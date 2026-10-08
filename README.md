# Clash 自定义规则

规则通过 GitHub Raw 发布，由 Mihomo 每小时自动更新。

## 使用

1. 打开 [clash-verge-aoko.js](https://raw.githubusercontent.com/lapluis/clash-rules/refs/heads/main/clash-verge-aoko.js)，复制全部内容。
2. 在 Clash Verge Rev 的「**订阅**」页面右键目标订阅，打开「**扩展脚本**」，粘贴 JS。如果已有脚本逻辑，需要先合并，避免直接覆盖。
3. 按订阅中的代理组名称调整脚本顶部 `policies`，保存脚本。日本组由脚本自动创建，详见下方「地区分组」。
4. 清空该订阅「编辑规则」中原来的 prepend/append/delete 自定义项。
5. 重新应用订阅，并在运行时配置中确认出现五个 `lapluis-custom-*` 规则集和 RULE-SET 规则。首次应用需要能够访问`raw.githubusercontent.com`。

## 地区分组

脚本根据节点名称开头的旗帜，自动创建香港、日本、美国、台湾四个手动选择组，并将地区选项加入以下代理组：

- 🤖 ChatGPT & Copilot
- 🎮 Steam Store & Community
- 🎥 NETFLIX
- 🎵 Spotify
- 🎥 巴哈姆特
- Ⓜ️ 微软服务
- 📲 电报信息
- 🍎 苹果服务

各组保留原有选项；其他组中由旧版脚本加入的地区选项会被清理。没有对应节点的地区不会创建空组。

缺少规则所需的代理组时，脚本会明确报错。

## 策略及顺序

| 文件 | 默认策略 |
| --- | --- |
| reject.yml | REJECT |
| direct.yml | DIRECT |
| ai.yml | 🤖 ChatGPT & Copilot |
| japan.yml | 🇯🇵 日本节点 |
| proxy.yml | 🔰 节点选择 |

## 文档

- https://wiki.metacubex.one/config/rule-providers/
- https://wiki.metacubex.one/config/rule-providers/content/
- https://www.clashverge.dev/guide/script.html
