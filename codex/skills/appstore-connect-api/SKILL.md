---
name: appstore-connect-api
description: 用本机 App Store Connect API 私钥免登录直连苹果开发者后台，查 App 审核状态 / 上架进度 / 构建包 / TestFlight / 商店文案 / 用户评论 / 销售数据，也能做写操作。用户问「过审了吗」「发布情况」「苹果那边怎么样了」「上架进度」「审核状态」「TestFlight」「证书 / 描述文件」，或任何需要读写 App Store Connect 的信息时，一律先用这个 skill——不要开浏览器、不要让用户去登录、不要以"网页登录过期"为由卡住。仅覆盖苹果侧；Google Play 不在此列。
---

# App Store Connect API（免登录直连）

## 1. 有这个

本机存着 TALKWAVE 苹果账号的 ASC API 私钥，可以绕开网页后台，直接向 Apple 服务器要数据：

- 私钥：`~/.appstoreconnect/private_keys/AuthKey_287GKA9ZF6.p8`（600 权限）
- 签名脚本（**唯一实现，勿另写一份**）：`~/IdeaProjects/ReLoop/scripts/asc-jwt.swift`

这条路不依赖浏览器会话，**网页后台登录过期也照用**——所以遇到 ASC 网页登录失效不要停下来找用户，直接走这里。

## 2. 怎么用

```bash
cd ~/IdeaProjects/ReLoop
TOKEN=$(swift scripts/asc-jwt.swift)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.appstoreconnect.apple.com/v1/apps/6798025365/appStoreVersions?limit=1"
```

token 有效期不超过 20 分钟（脚本给 1000 秒），每次现签即可，不必缓存。URL 里的 `[` `]` 要转义成 `%5B` `%5D`。ReLoop 的 App ID = `6798025365`。

## 3. 大概能干嘛（2026-08-07 用本密钥逐个实测）

**读得到**：应用与版本（含 `appStoreState` 审核状态机）、构建包与处理状态、审核提交单、商店文案与分类、TestFlight 组与测试员、用户评论、价格计划、上架地区、内购与订阅、证书 / Bundle ID / 描述文件 / 测试设备、团队成员、Xcode Cloud。

**销售报表**也能拿，但要真实 vendorNumber，且请求头带 `Accept: application/a-gzip`。

**拿不到**：`analyticsReports` 分析报表（403，本密钥角色不够）；**创建证书**也不行（历史踩坑，只能去开发者门户手动签）。

**写操作**（改版本信息、提审、手动发布、拉 TestFlight 成员）走 JSON:API 的 POST/PATCH，能力是有的，但**动手前先跟用户确认**——这些是对外可见、难以撤回的动作。

## 4. 去哪看能干嘛（全量）

- **Apple 官方参考**：https://developer.apple.com/documentation/appstoreconnectapi ——左侧导航就是完整端点分域（Apps / Builds / TestFlight / Provisioning / Reporting / Users）。要什么现查，别凭记忆猜路径。
- **本机实战 runbook**：`~/IdeaProjects/ReLoop/docs/ops/app-release.md` §「iOS 签名与构建（工程 runbook）」——密钥出处、导出上传命令、审核状态机流转、踩过的坑都在那。

## 5. 边界

- 私钥内容永不写进文档 / 代码 / 日志；密钥 ID 与 issuer ID 不是秘密，已在签名脚本里。
- 苹果账号的密码与二次验证一律用户自己来，不代输。
- 只覆盖苹果侧。Google Play 是另一套（服务账号 JSON + Android Publisher API），不在本 skill 范围。
