# Clash 自定义规则

规则通过 GitHub Raw 发布，由 Mihomo 每小时自动更新。

## 使用

1. 将本仓库推送到 GitHub 的 main 分支（若远程默认分支不同，调整脚本中的 baseURL）。公开仓库可以直接使用当前下载地址；私有仓库需要另外配置鉴权。
2. 在 Clash Verge Rev 的订阅页面打开「全局扩展脚本」，粘贴 clash-verge-aoko.js 的全部内容并保存。
3. 根据各设备订阅的代理组名称，调整脚本顶部 policies。缺少代理组时脚本会明确报错。
4. 清空每个订阅「编辑规则」中原来的 prepend/append/delete 自定义项，避免重复。检查订阅扩展脚本或扩展配置没有再次覆盖 rules。
5. 重新应用配置，并在运行时配置中确认出现五个 lapluis-custom-* 规则集和 RULE-SET 规则。首次应用需要能够访问 raw.githubusercontent.com。

之后编辑 rules/*.yml 并推送，各设备会在下一次规则集更新时获取。脚本本身的变化需要重新粘贴到各设备；规则内容更新无需改脚本。其他 Mihomo 客户端可使用同样的规则集，但应按客户端方式配置 rule-providers 和 RULE-SET。

## 策略及顺序

| 文件 | 默认策略 |
| --- | --- |
| ai.yml | 🤖 ChatGPT & Copilot |
| japan.yml | 日本节点（当前映射到 🍎 苹果服务） |
| direct.yml | DIRECT |
| proxy.yml | 🔰 节点选择 |
| reject.yml | REJECT |

从旧版迁移时，重新粘贴全局脚本；脚本会清理旧的 lapluis-custom-apple 规则引用。

规则集内部只有匹配条件，不带策略。全局脚本按上表顺序插入到订阅规则前面。当前规则按匹配范围整理，保留 Google 正则优先于 jp 后缀、域名例外优先于 Adobe 进程拦截的意图。以后增加跨集合重叠的规则时，需要检查上表优先级；不保证任意交错的原始规则顺序。

## 文档

- https://wiki.metacubex.one/config/rule-providers/
- https://wiki.metacubex.one/config/rule-providers/content/
- https://www.clashverge.dev/guide/script.html
