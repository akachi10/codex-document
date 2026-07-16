---
name: dispatch-briefing
description: 派单简报六段式模板 + 派单前检查清单 + 停滞管理循环。当 session/SM 要派 subagent 或 teammate 做开发、审查、测试、数据工程任务时使用——把口头需求转成结构化派单 prompt，避免交付通道失误、假绿接盘、停滞无人管。历史上该模板在 40+ 次派单中被逐字手打，本 skill 将其固化。
---

# 派单简报（dispatch-briefing）

## 何时使用

派任何 subagent / teammate 执行开发、code-review、测试、数据工程任务时。目标：**agent 只凭这一份 prompt 就能独立完成并正确交付**，不需要中途回来问。

## 派单前检查清单（先过一遍再写 prompt）

1. **交付通道预判**（历史上至少 5 次事后补救）：该 agent 类型有没有 Write 工具？
   - 有 → 报告写到指定文件路径
   - 没有（code-reviewer / system-architect 等只读角色）→ 派单里**明确写**"以完整 markdown 文本作为最终消息返回，由 session 落盘"；长报告分多条发、每条 ≤150 行
2. **上下文自足**：项目绝对路径、必读文档路径（含空格的路径加引号）、既有代码锚点（类/文件位置）都写全——agent 没有你的对话记忆
3. **数据纪律**：涉及生产环境时写明红线（测试数据不许自行清理、由用户决定处置；生产禁真发外部消息；API-first）
4. **执行体选择**：默认使用 Codex 原生 subagent（`collaboration.spawn_agent`，后续用 `collaboration.send_message` / `collaboration.followup_task` / `collaboration.wait_agent` 协调）；审查、测试或第二诊断需要异质视角时，再应用 `claude-delegate` 调 Claude worker

## 六段式模板

```markdown
# 必读
- <项目根>/AGENTS.md（项目契约）
- <本任务的设计/需求文档路径>（硬锚点来源）
- <既有代码锚点：目录或关键类，说明现状>
- docs/common-methods.md（先查既有通用方法，禁止重复实现）

# 你这一步要做什么
<一句话业务目标 + 端点/页面/数据的具体形态>

# 硬锚点（不可妥协）
1. <逐条列出不许走样的决策：schema 动不动、复用哪个既有实现（Default-Value Overload）、
   取值范围、错误处理形态（BusinessException → ApiResponse）、i18n 语种齐备、OpenAPI 注解……>
2. <遇到必须偏离锚点的情况：先停下来在报告中说明，不擅自决定>

# 边界（不做的事）
- <明确排除项：不动哪端、不改哪些既有行为、不做哪个相邻功能>

# TDD 流程
应用 ~/.codex/skills/test-driven-development/SKILL.md（bug 修复再叠加 tdd-amendment-bug-fix）。
先写失败测试（含 DB 状态断言），看红再实现。

# 验证
<可执行的验证命令 + 通过基线，如：mvn test 全量绿（基线 N），npm run build 成功>

# 报告
<要求回传的具体字段：改动文件清单、测试数字（新增/总数）、每条硬锚点如何满足、
 是否登记 common-methods.md、异常事项段（允许跳过的怪 case 必须留痕）>
```

## 派单后管理循环

- **标状态**：派单即把任务标 in_progress，完成即 completed
- **停滞检测**：agent 空闲但工作区无改动 / 长时间无消息 → 先催报一次（"汇报当前进度与卡点"）
- **收回重派**：催报后仍停滞 → 明确宣布"任务已从你处收回"，重派新 agent；新 agent 派单里要求**先跑 test/build 盘点现状**再续做（防假绿接盘——曾有"逻辑层全好、展示层全是桩"被报成完成）
- **同一问题连续失败 >10 次** → 标 BLOCKED 通知用户

## 验收纪律

- **agent 报绿 ≠ 绿**。一切以实证为准：后端改动必须 rollout 后 curl 出新行为；数据改动必须 psql 回查；UI 改动看截图
- 不能用"接口 200 + success:true"作为新代码生效证据（旧代码也会 200）
