# Clash 自定义规则

规则通过 GitHub Raw 发布，由 Mihomo 每小时自动更新。

## 使用

1. 打开 [clash-verge-aoko.js](https://raw.githubusercontent.com/lapluis/clash-rules/refs/heads/main/clash-verge-aoko.js)，复制全部内容。
2. 在 Clash Verge Rev 的「**订阅**」页面右键目标订阅，打开「**扩展脚本**」，粘贴 JS。如果已有脚本逻辑，需要先合并，避免直接覆盖。
3. 按订阅中的代理组名称调整脚本顶部 `policies`，保存脚本。日本组由脚本自动创建，详见下方「地区分组」。
4. 清空该订阅「编辑规则」中原来的 prepend/append/delete 自定义项。
5. 重新应用订阅，并在运行时配置中确认出现五个 `lapluis-custom-*` 规则集和 RULE-SET 规则。首次应用需要能够访问`raw.githubusercontent.com`。

## 地区分组

脚本根据节点名称开头的旗帜，自动创建香港、日本、韩国、美国、台湾五个手动选择组，并将地区选项加入以下代理组：

- 🔰 节点选择
- 🤖 ChatGPT & Copilot
- 🎮 Steam Store & Community
- 🎥 NETFLIX
- 🎵 Spotify
- 🎥 巴哈姆特
- Ⓜ️ 微软服务
- 📲 电报信息
- 🍎 苹果服务

主「🔰 节点选择」组内，地区选项置顶；其他服务组若已有「🔰 节点选择」选项，则按「节点选择 → 地区 → 其余选项」排列，没有该选项时地区置顶。其余选项保持相对顺序。

每个地区组的第一个选项是该地区的自动选择子组，例如「🇯🇵 日本自动选择」，后面保留该地区的具体节点。选择自动子组时在该地区内自动挑选节点；选择具体节点时固定使用该节点。服务组仍只加入五个地区入口。自动子组设置 `hidden: true`，在支持该字段的界面中隐藏独立分组，地区组内仍保留自动选择入口；同时将自动子组移至配置的分组列表末尾，兼容未隐藏它们的界面。

自动子组使用 `url-test`，测速地址为 `https://cp.cloudflare.com/generate_204`，间隔 `1800` 秒（30 分钟），切换容差 `150` ms，`lazy: false`（未使用时也定期测速）。测速衡量请求延迟，不代表下载速度或服务解锁能力。已有的手动选择记录可能被客户端保留，需要自动选择时可在地区组内选中自动子组。机场原有的全局「♻️ 自动选择」不受影响。

地区分组按香港、日本、韩国、美国、台湾的顺序排列，放在「广告拦截」分组之前；没有该分组时放在末尾。各组保留原有选项；其他组中由旧版脚本加入的地区选项会被清理。没有对应节点的地区不会创建手动组或自动子组。

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
