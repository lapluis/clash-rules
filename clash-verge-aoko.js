// Paste this entire file into Clash Verge Rev's global extension script.
// Set branch to your GitHub default branch if it is not main.
const baseURL = "https://raw.githubusercontent.com/lapluis/clash-rules/main/rules";
const policies = {
  ai: "🤖 ChatGPT & Copilot",
  // Japan routing: this subscription uses the Apple group with a Japanese node selected.
  japan: "🍎 苹果服务",
  direct: "DIRECT",
  proxy: "🔰 节点选择",
  reject: "REJECT",
};
// Google regex must precede the general Japanese-domain rule.
// Rejections take precedence over all direct and proxy routing.
const order = ["reject", "direct", "ai", "japan", "proxy"];

function main(config) {
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
