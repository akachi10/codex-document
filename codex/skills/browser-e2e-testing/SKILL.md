---
name: browser-e2e-testing
description: Web 浏览器端到端测试工具方法。Playwright 脚本规范、截图函数、选择器避坑、DB 验证模板、报告 Markdown 模板。本 skill 是 Web 客户端的执行工具书，不规定测试流程或角色协作。
---

# Web 浏览器 E2E 测试 — 工具方法

本 skill 是 Web 客户端浏览器自动化的**工具书**：怎么用 Playwright + psql + Markdown 把一个浏览器测试做完整。

**适用场景**：任何需要在 Web 浏览器中执行端到端测试 + 用截图作为证据 + 用 DB 验证落库的工作。

**不规定**：谁做测试、什么时候做、测试 vs 验收的分工、覆盖率、判定哲学——这些是流程契约，不在本工具书内。

## 触发条件

- 需要在 Web 浏览器里跑端到端测试
- 需要截图作为视觉证据
- 需要 SQL 验证数据落库

## 前置检查清单

执行前逐项确认，任一失败先修复。具体端口、URL、Token 从项目的 `docs/testing/browser-test-guide.md` 获取。

- [ ] Playwright chromium 已安装（`npx playwright --version`，缺失则 `npx playwright install chromium`）
- [ ] psql 可用（`psql --version`）
- [ ] 数据库可连接（`psql -h HOST -U USER -d DB -c "SELECT 1"`）
- [ ] 后端服务运行中（curl 后端端口返回 200 或 401）
- [ ] 前端服务运行中（curl 前端端口返回 200）

## 批次目录布局

每次测试用一个批次 ID 隔离截图和报告。批次 ID 格式 `YYYYMMDD-HHMM`（由调用方生成传入）。

```
docs/testing/screenshots/{批次ID}/
├── index.md                          # 批次概览（可选）
├── s1/                               # 系列 1 截图
│   ├── 001-login.png
│   ├── 002-inventory-page.png
│   └── ...
├── s1-acceptance-report.md           # 系列 1 报告
├── s1-r2/                            # 系列 1 第 2 轮重测
├── s1-r2-acceptance-report.md
└── ...
```

- **截图命名**：`NNN-描述.png`（三位数序号 + 短横线 + 简短描述）
- **报告命名**：`s{N}-acceptance-report.md`
- 截图和报告**不进 git**

## Playwright 脚本规范

### 关键函数签名

完整模板放在 `docs/testing/browser-test-guide.md`。核心两个：

```python
def shot(page, name) -> str:
    """截图 → docs/testing/screenshots/{批次ID}/s{N}/NNN-name.png，返回相对路径"""
    path = f"s{N}/{seq:03d}-{name}.png"
    page.screenshot(path=f"docs/testing/screenshots/{batch_id}/{path}", full_page=True)
    seq += 1
    return path

def db(sql) -> str:
    """psql 查询 → 返回结果文本，用于 DB 验证。
    连接信息（HOST/USER/DB）从项目 docs/testing/browser-test-guide.md 取，不要写死跨项目的库名。"""
    return subprocess.check_output(
        ["psql", "-h", "127.0.0.1", "-U", "<项目USER>", "-d", "<项目DB>", "-tAc", sql]
    ).decode().strip()
```

### Headless 默认开启

- **默认 `headless=True`**：后台跑，截图保留视觉证据
- **仅本地调试** `headless=False`：自动化运行场景禁用（后台看不到）

### 截图频次

- **操作前 + 操作后都要截图**（同一动作通常 2 张以上）
- **关键交互单独截图**：弹窗、下拉展开、Toast、错误提示
- **数据变更类操作**：操作前查 DB → 操作 → 截图 → 操作后查 DB

### 数据清理（强制 try/finally）

```python
try:
    # 测试逻辑
    ...
finally:
    # 删除本次创建的所有测试数据
    # 验证 DB 行数恢复到测试前基线
    ...
```

## 选择器避坑（Web 专属）

| 正确做法 | 反模式 |
|----------|--------|
| 先截图看页面结构，再决定选择器 | 不看页面直接猜选择器 |
| 用精确选择器区分邮箱登录和 OAuth 按钮 | 用 `has-text("Sign In")` 误匹配到 Google 登录 |
| 下拉框：先点开 → 截图展开状态 → 再点选项 | 直接 click option 不看展开状态 |
| 异步操作后等待再验证（`wait_for_load_state` / `wait_for_selector`） | 触发异步后立即断言 |
| 用 `page.locator().is_visible()` / `page.inner_text()` 验证可见状态 | 用 `page.content()` 拿 HTML 源码做断言 |
| 填写前 + 填写后 + 提交后都截图 | 只截最终结果 |

## 白盒分层逐级核验（核心方法论，强制）

**E2E 不是只看页面（黑盒）。每个"期望发生的事"必须自底向上、分层逐级核验，不跳级。** 完整方法论见 **`layered-diagnosis` skill**——它规定了为什么分层、四层顺序（数据→接口→渲染→视觉）、每层留证据、前一层 PASS 才往上、FAIL 时报告必须指出断在哪一层。做 E2E 时**必读必用**那个 skill。

本 skill 只补充 Web 场景下"怎么给每一层留证据"的工具：

1. **数据层（DB）**——用本 skill 的 `db()` 函数 SQL 确认数据落库 / 变更。
2. **接口层（API）**——`curl` 该接口看 ApiResponse（含 HTTP 状态码），或抓浏览器网络面板里的响应。
3. **渲染层（前端拿到的数据）**——用 `page.inner_text()` / 网络面板里前端实际收到的响应，**不是** `page.content()` 抓 HTML 源码硬断。
4. **视觉层（截图）**——本 skill 的 `shot()` 函数截图，作为 PASS/FAIL 的最终视觉判定依据。

> 四层与"截图是 PASS/FAIL 唯一依据"不冲突：截图是最终视觉判定 + 缺图自动 FAIL；前三层是**定位手段**，让 FAIL 时知道去哪修。判定哲学与定位骨架在 `layered-diagnosis`，本节只给 Web 工具映射。

## 报告 Markdown 模板

### 系列报告（`s{N}-acceptance-report.md`）

```markdown
# S{N}: {功能域} 测试报告

> 批次：{批次ID} | 截图目录：s{N}/

## 汇总

| 总数 | PASS | FAIL |
|------|------|------|

## 测试结果

| # | 步骤 | 截图 | 后台调用链路 | DB 变化 | 评价 | 结果 |
|---|------|------|-------------|---------|------|------|
| 1 | 创建品牌 "Test" | ![](s1/001-create-brand.png) | POST /api/brands → BrandService.create() → INSERT prd_brand | prd_brand +1 行 (code=xxx, name=Test) | 正常：API 返回 success，列表刷新显示新品牌 | PASS |
| 2 | 提交议价 $300 | ![](s1/002-submit-bid.png) | PUT /api/public/purchase-order/{id}/submit | purchase_order: status draft→submitted; +2 item 行 | 正常：页面跳转"已提交"视图 | PASS |

## Bug 列表

| # | 严重级 | 页面/组件 | 描述 | 复现步骤 | 期望行为 | 实际行为 | 截图 |
|---|--------|-----------|------|----------|----------|----------|------|

## 清理验证

测试前后 DB 行数对比：

| 表 | 测试前 | 测试后 | 差值 |
|----|--------|--------|------|
| prd_brand | 5 | 5 | 0 ✅ |
| purchase_order | 100 | 100 | 0 ✅ |
```

### 批次概览（`index.md`，可选）

```markdown
# E2E 测试批次 {批次ID}

> 日期：{日期}
> 触发原因：{Sprint 名称 / 回归测试 / 用户请求}
> 环境：前端 {URL}，后端 {URL}，数据库 {连接信息}

## 系列总览

| 系列 | 功能域 | TC 数 | 通过 | 失败 | 报告 |
|------|--------|-------|------|------|------|
| S1 | 库存管理 | 8 | 7 | 1 | [s1-acceptance-report.md](s1-acceptance-report.md) |
| S2 | 公开库存页 | 5 | 5 | 0 | [s2-acceptance-report.md](s2-acceptance-report.md) |
```

## 子批次（重测）规则

修复 BUG 后的重测在主批次目录下创建子目录，**主批次不变**（历史记录不可覆盖）：

```
docs/testing/screenshots/20260415-1700/     # 主批次
├── s1/                                      # S1 初始测试截图
├── s1-acceptance-report.md                  # S1 初始报告（不可改）
├── s1-r2/                                   # S1 修复后重测截图
├── s1-r2-acceptance-report.md               # S1 重测报告
├── s2/
└── s2-acceptance-report.md
```

- **子批次 ID**：`s{N}-r{轮次}`（如 `s1-r2` = S1 第 2 轮重测）
- 子批次只重测受影响的步骤，不重跑全部
- 子批次报告引用初始报告，说明"修复了哪些问题，回归了哪些步骤"

## 与文档的接口

| 文档 | 用途 |
|------|------|
| `docs/testing/browser-test-guide.md` | 项目专属：环境信息、登录选择器、Playwright 完整脚本模板、测试数据 |

每次测试后更新 `browser-test-guide.md`，把新发现的选择器、登录流程、测试数据沉淀进去（这是唯一进 git 的测试文档）。

## 核心规则速查（正反对照）

| 正确做法 | 反模式 |
|----------|--------|
| 先截图看页面结构再决定选择器 | 不看页面直接猜选择器 |
| 精确选择器区分邮箱登录和 OAuth | `has-text("Sign In")` 误匹配 Google 登录 |
| 按功能域并行多个系列 | 一个脚本串行跑所有 |
| 每次数据变更都 SQL 确认 | 跳过数据库验证 |
| try/finally 清理 + 验证行数恢复 | 测试数据不清理 |
| 下拉框先点开 → 截图 → 再点选项 | 直接 click option 不看展开状态 |
| 异步操作后等待再验证 | 触发异步后立即断言 |
| 默认 headless + 截图 | 非调试场景用 headless=False |
| 操作前/操作后/关键交互都截图 | 只截最终结果 |
| `page.inner_text()` / `is_visible()` 验证可见状态 | `page.content()` 用 HTML 源码断言 |
