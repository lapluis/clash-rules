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
  { flag: "🇺🇸", name: "🇺🇸 美国节点" },
  { flag: "🇹🇼", name: "🇹🇼 台湾节点" },
];

function addRegionGroups(config) {
  const groups = config["proxy-groups"] || [];
  const nodes = config.proxies || [];
  const regionNames = new Set(regions.map(region => region.name));
  const remaining = groups.filter(group => !regionNames.has(group.name));
  const generated = regions.flatMap(region => {
    const names = [...new Set(nodes
      .filter(node => typeof node.name === "string" && node.name.trimStart().startsWith(region.flag))
      .map(node => node.name))];
    if (!names.length) return [];
    const existing = groups.find(group => group.name === region.name);
    // Preserve group settings.
    return [{ type: "select", ...existing, name: region.name, proxies: names }];
  });
  const generatedNames = generated.map(group => group.name);
  const serviceGroups = new Set([
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
      group.proxies = [...new Set([
        ...(group.proxies || []).filter(name => !regionNames.has(name)),
        ...generatedNames,
      ])];
    } else if (Array.isArray(group.proxies)) {
      // Clean up legacy region choices.
      group.proxies = group.proxies.filter(name => !regionNames.has(name));
    }
  });
  config["proxy-groups"] = [...remaining, ...generated];
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
  const existing = (config.rules || []).filter(rule =>
    ! [...order, "apple"].some(key => rule.startsWith(`RULE-SET,lapluis-custom-${key},`))
  );
  config.rules = [...prepend, ...existing];
  return config;
}
