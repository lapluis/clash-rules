// Paste this entire file into Clash Verge Rev's global extension script.
// Set branch to your GitHub default branch if it is not main.
const baseURL = "https://raw.githubusercontent.com/lapluis/clash-rules/main/rules";
const policies = {
  ai: "🤖 ChatGPT & Copilot",
  japan: "🇯🇵 日本节点",
  direct: "DIRECT",
  proxy: "🔰 节点选择",
  reject: "REJECT",
};
// Google regex must precede the general Japanese-domain rule.
// Rejections take precedence over all direct and proxy routing.
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
  // Rebuild only the groups owned by this script on every application.
  const remaining = groups.filter(group => !regionNames.has(group.name));
  const generated = regions.flatMap(region => {
    const names = [...new Set(nodes
      .filter(node => typeof node.name === "string" && node.name.trimStart().startsWith(region.flag))
      .map(node => node.name))];
    // Empty groups cannot be used by Mihomo.
    return names.length ? [{ name: region.name, type: "select", proxies: names }] : [];
  });
  const generatedNames = generated.map(group => group.name);
  // Keep existing selections and expose the region groups in node selection.
  const selection = remaining.find(group => group.name === policies.proxy);
  if (selection) {
    selection.proxies = [...new Set([
      ...(selection.proxies || []).filter(name => !regionNames.has(name)),
      ...generatedNames,
    ])];
  }
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
