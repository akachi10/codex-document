---
name: source-archiving
description: 发文前外链存档 skill。三层备档（Wayback / Archive.today / 本地截图）。何时使用：文章定稿、submit 之前最后一步；引用了任何外站链接的文章发布前。
---

# source-archiving — 外链存档

发文前把所有外链丢进存档系统。**没存档不准 submit。**

为什么：外站会改稿、删稿、改 URL、域名失效、被墙。文章里的链接 6 个月后死掉，引用就成了无证据。

## 何时使用

- 文章已通过 `fact-checking`，准备 submit
- 引用了任何外站链接（外媒报道 / 公司公告 / Tweet / 论文 / 数据页）
- 旧文章的某条引用链接死了，需要补存档（事后补救）

## 三层备档策略

### 第 1 层：Wayback Machine（首选）

**特点**：覆盖广、免费、长期保存、API 公开。

**Save API**（最快）：

```bash
curl -X POST https://web.archive.org/save/<原 URL> \
  -H "Authorization: LOW <ACCESS_KEY>:<SECRET>" \
  -d "capture_outlinks=0"
```

无 token 也能用（速率限制更严）：

```bash
curl https://web.archive.org/save/<原 URL>
```

**返回**：`https://web.archive.org/web/<timestamp>/<原 URL>`，把这条放到文章末尾「来源存档」。

**注意**：
- 某些网站（NYT 部分页、X 部分页）会拒绝抓取，返回 4xx
- 抓取大概要 10-60 秒，急用 API 加 `&capture_all=1`
- 同一 URL 6 小时内 Wayback 不会重抓，会返回最近一次快照

### 第 2 层：Archive.today（兜底）

**特点**：能抓 Wayback 抓不动的（X / 部分被墙站）；保存图片渲染版（截图式）。

**用法**：

```
https://archive.ph/?url=<原 URL>
```

或浏览器打开 `https://archive.ph/`，粘贴 URL，点 "save"。

**API**（受限）：archive.today 没正经 API，但可以 GET 触发：

```bash
curl -L "https://archive.ph/newest/<原 URL>"  # 找最新存档
curl -L "https://archive.ph/?run=1&url=<原 URL>"  # 触发新存档
```

**返回**：`https://archive.ph/<5字符 ID>` 或 `https://archive.today/<原 URL>`

### 第 3 层：Memento Time Travel（兜底中的兜底）

**特点**：聚合多个存档源（Wayback + archive.is + UK Web Archive 等），找到任意一份历史快照。

**用法**：

```
https://timetravel.mementoweb.org/api/json/<YYYYMMDDHHMMSS>/<原 URL>
```

返回 JSON，列出所有可用存档源。

### 第 4 层：本地截图（最后手段）

如果三层全失败：

1. 浏览器打开原 URL
2. F12 全屏截图：DevTools 三点菜单 → More tools → Capture full size screenshot（Chrome）
3. 文件名：`{article-slug}-source-{N}-{YYYY-MM-DD}.png`
4. 存到 `docs/maintainer/screenshots/{article-slug}/`（或项目 persona 指定的等价路径）
5. 同时存 PDF：浏览器打印 → 另存为 PDF
6. 在文章注释里说明"原始链接 X 当时无法存档，已本地截图存留为证"

## 存档失败兜底

| 情况 | 处理 |
|---|---|
| Wayback 返回 5xx | 等 1 分钟重试；连续 3 次失败转 Archive.today |
| Wayback 返回 4xx | 直接转 Archive.today |
| Archive.today 拒抓 | 转 Memento 找历史快照；如有历史快照引用历史的；如无走本地截图 |
| 全部失败 | 本地截图 + 在文末「来源存档」标注「该来源无法第三方存档，本地存档由编辑部保存」 |

## 文章末尾「来源存档」清单格式

每篇引用了外链的稿件，**正文末尾**加：

```markdown
---

## 来源存档

| 引用 | 原始链接 | 存档链接 | 存档时间 |
|---|---|---|---|
| 路透社报道 | https://reuters.com/article/... | https://web.archive.org/web/20260428143012/https://reuters.com/... | 2026-04-28 14:30 |
| OpenAI 官方公告 | https://openai.com/blog/... | https://archive.ph/abc12 | 2026-04-28 14:31 |
| 当事人 X 帖子 | https://x.com/.../status/... | （本地截图，见编辑部留档） | 2026-04-28 14:32 |
```

读者点进去原始链接，如果 404 / 被删 / 被改，至少能从存档链接看到当时的版本。

## 标准化批量脚本

如果一篇文章有 5+ 个外链，手工挨个调太慢。建议：

1. 把所有外链列到一个 txt 文件（一行一个 URL）
2. 跑一个 bash 循环：

```bash
while IFS= read -r url; do
  echo "Archiving: $url"
  curl -s -o /dev/null -w "%{http_code}\n" "https://web.archive.org/save/$url"
  sleep 5  # 防 rate limit
done < urls.txt
```

3. 等 Wayback 抓完（~5 分钟），再去 https://web.archive.org/wayback/available?url=<URL> 查每条的 timestamp，写进文章

## X / 微博 等 SNS 的特殊处理

- **X**：Wayback 经常抓不到登录后的页面；Archive.today 可以；建议两个都试
- **微博**：Wayback 抓不到（需中文登录）；Archive.today 中文站点支持有限；优先本地截图
- **TG 频道**：用 https://t.me/s/<频道名>/<msg_id>（带 `s/` 是网页快照，能被 Archive.today 抓）
- **TikTok / 抖音**：本地下载视频文件 + 截图为最佳

## 自检

submit 前回答：

1. 文章里所有外链都存档了吗？（包括正文链接和图片来源链接）
2. 「来源存档」表格在文末了吗？
3. 至少有一份存档链接能打开吗（不要存了一个 5xx 的链接进去）？
4. X / 微博 / TG 等存档失败的，本地截图了吗？

任一答否 → 不能 submit。

## 反例（什么时候不要用本 skill）

- 还没写完正文（先 `news-writing`）
- 还没事实核查（先 `fact-checking`）
- 文章纯主编观点段、没有任何外链 → 跳过本 skill 直接 submit
- 内部参考资料（如政府内网链接）—— 跳过存档（跳过本 skill），但稿件里也不该出现内部链接，回查为什么用了
