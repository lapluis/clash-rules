# Clash 自定义规则

规则通过 GitHub Raw 发布，由 Mihomo 每小时自动更新。

## 使用

1. 打开 [clash-verge-aoko.js](https://raw.githubusercontent.com/lapluis/clash-rules/refs/heads/main/clash-verge-aoko.js)，复制全部内容。
2. 在 Clash Verge Rev 的「**订阅**」页面右键目标订阅，打开「**扩展脚本**」，粘贴 JS。如果已有脚本逻辑，需要先合并，避免直接覆盖。
3. 将脚本顶部 policies 调整为该订阅实际存在的代理组名称并保存。脚本按节点名称开头的国旗自动创建香港、日本、美国、台湾四个地区的手动选择组，并加入「🔰 节点选择」。没有对应节点的地区不会创建空组；缺少规则所需的代理组（包括日本组）时脚本会明确报错。
4. 清空该订阅「编辑规则」中原来的 prepend/append/delete 自定义项。
5. 重新应用订阅，并在运行时配置中确认出现五个 lapluis-custom-* 规则集和 RULE-SET 规则。首次应用需要能够访问`raw.githubusercontent.com`。

## 策略及顺序

| 文件 | 默认策略 |
| --- | --- |
| reject.yml | REJECT |
| direct.yml | DIRECT |
| ai.yml | 🤖 ChatGPT & Copilot |
| japan.yml | 🇯🇵 日本节点（按 🇯🇵 国旗自动分组） |
| proxy.yml | 🔰 节点选择 |

## 文档

- https://wiki.metacubex.one/config/rule-providers/
- https://wiki.metacubex.one/config/rule-providers/content/
- https://www.clashverge.dev/guide/script.html
