const baseURL = "https://raw.githubusercontent.com/lapluis/clash-rules/main/rules";
const policies = {
  ai: "🤖 ChatGPT & Copilot",
  steam: "🎮 Steam Store & Community",
  netflix: "🎥 NETFLIX",
  spotify: "🎵 Spotify",
  bahamut: "🎥 巴哈姆特",
  microsoft: "Ⓜ️ 微软服务",
  telegram: "📲 电报信息",
  apple: "🍎 苹果服务",
  japan: "🇯🇵 日本节点",
  direct: "DIRECT",
  proxy: "🔰 节点选择",
  reject: "REJECT",
};
const order = ["reject", "direct", "ai", "japan", "proxy"];

const regions = [
  { flag: "🇭🇰", name: "🇭🇰 香港节点" },
  { flag: "🇯🇵", name: "🇯🇵 日本节点" },
  { flag: "🇰🇷", name: "🇰🇷 韩国节点" },
  { flag: "🇺🇸", name: "🇺🇸 美国节点" },
  { flag: "🇹🇼", name: "🇹🇼 台湾节点" },
].map(region => ({
  ...region,
  autoName: `${region.flag} 自动选择`,
  legacyAutoName: region.name.replace("节点", "自动选择"),
}));

function addRegionGroups(config) {
  const groups = config["proxy-groups"] || [];
  const nodes = config.proxies || [];
  const regionNames = new Set(regions.map(region => region.name));
  const managedNames = new Set(regions.flatMap(region => [region.name, region.autoName, region.legacyAutoName]));
  const remaining = groups.filter(group => !managedNames.has(group.name));
  const generated = regions.flatMap(region => {
    const names = [...new Set(nodes
      .filter(node => typeof node.name === "string" && node.name.trimStart().startsWith(region.flag))
      .map(node => node.name))];
    if (!names.length) return [];
    const existing = groups.find(group => group.name === region.name);
    const existingAuto = groups.find(group => group.name === region.autoName)
      || groups.find(group => group.name === region.legacyAutoName);
    // Keep manual node choices alongside a region-only automatic selector.
    return [
      { ...existing, type: "select", name: region.name, proxies: [region.autoName, ...names] },
      {
        ...existingAuto,
        name: region.autoName,
        type: "url-test",
        proxies: names,
        url: "https://cp.cloudflare.com/generate_204",
        interval: 900,
        tolerance: 250,
        lazy: true,
        hidden: true,
      },
    ];
  });
  const regionGroups = generated.filter(group => regionNames.has(group.name));
  const autoGroups = generated.filter(group => !regionNames.has(group.name));
  const generatedNames = regionGroups.map(group => group.name);
  const serviceGroups = new Set([
    policies.proxy,
    policies.ai,
    policies.steam,
    policies.netflix,
    policies.spotify,
    policies.bahamut,
    policies.microsoft,
    policies.telegram,
    policies.apple,
  ]);
  remaining.forEach(group => {
    if (serviceGroups.has(group.name)) {
      const choices = (group.proxies || []).filter(name => !managedNames.has(name));
      const primary = group.name !== policies.proxy && choices.includes(policies.proxy)
        ? [policies.proxy]
        : [];
      group.proxies = [...new Set([
        ...primary,
        ...generatedNames,
        ...choices.filter(name => !primary.includes(name)),
      ])];
    } else if (Array.isArray(group.proxies)) {
      // Clean up legacy region choices.
      group.proxies = group.proxies.filter(name => !managedNames.has(name));
    }
  });
  const adBlockIndex = remaining.findIndex(group => group.name.includes("广告拦截"));
  const insertIndex = adBlockIndex === -1 ? remaining.length : adBlockIndex;
  config["proxy-groups"] = [
    ...remaining.slice(0, insertIndex),
    ...regionGroups,
    ...remaining.slice(insertIndex),
    ...autoGroups,
  ];
}

function main(config) {
  addRegionGroups(config);
  const available = new Set([
    "DIRECT", "REJECT",
    ...(config["proxy-groups"] || []).map(p => p.name),
    ...(config.proxies || []).map(p => p.name),
  ]);
  for (const key of order) {
    if (!available.has(policies[key])) {
      throw new Error(`Custom rules: missing policy ${policies[key]}; edit policies for this device.`);
    }
  }
  config["rule-providers"] = config["rule-providers"] || {};
  const prepend = order.map(key => {
    const name = `lapluis-custom-${key}`;
    config["rule-providers"][name] = {
      type: "http",
      behavior: "classical",
      format: "yaml",
      url: `${baseURL}/${key}.yml`,
      path: `./rules/${name}.yml`,
      interval: 3600,
    };
    return `RULE-SET,${name},${policies[key]}`;
  });
  const geminiName = "MetaCubeX-google-gemini";
  config["rule-providers"][geminiName] = {
    type: "http",
    behavior: "domain",
    format: "text",
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-gemini.list",
    path: `./rules/${geminiName}.list`,
    interval: 3600,
  };
  prepend.splice(order.indexOf("ai") + 1, 0, `RULE-SET,${geminiName},${policies.ai}`);
  const existing = (config.rules || []).filter(rule =>
    !rule.startsWith(`RULE-SET,${geminiName},`) &&
    ! [...order, "apple"].some(key => rule.startsWith(`RULE-SET,lapluis-custom-${key},`))
  );
  config.rules = [...prepend, ...existing];
  return config;
}
