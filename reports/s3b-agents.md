# S3b Codex agent 载体适配施工报告

## 范围

以 `~/.claude/agents/` 中各角色的当前 Markdown 为教义权威，将角色定义仅做 Codex 载体适配后同步到 `~/.codex/agents/` 及仓库镜像 `codex/agents/`。

## 方法

每个角色严格执行单文件循环：确认备份不存在并备份 Codex 现状、对照 Claude 权威内容做最小载体适配、保持 TOML wrapper schema 并逐字同步正文、检查禁用残留与 skill 路径、同步仓库镜像并做字节一致性验证。

## 文件施工记录

### backend-designer

- Claude 权威：`/Users/taoyawei/.claude/agents/backend-designer.md`
- 行数：Codex Markdown `33 → 33`；TOML `32 → 32`
- 适配点：剔除 Claude-only frontmatter，仅保留 `name` / `description`；保留 Claude 现文的 Schema-First、接口定义、设计模式与不过度设计教义；补齐 Codex subagent 不二次派单、依赖返回 Session 并由 Session 使用 `send_message` / `followup_task` 协调的载体边界。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`backend-designer.md` 与 `backend-designer.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/backend-designer.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/backend-designer.toml.bak-s3-20260716`。

### backend-dev

- Claude 权威：`/Users/taoyawei/.claude/agents/backend-dev.md`
- 行数：Codex Markdown `97 → 69`；TOML `96 → 68`
- 适配点：恢复 Claude 现文的任务相关测试文档与权威运维总览读取口径，保留 TDD、两级逐级验证、分层诊断及小任务边界教义；Claude 协作动作改为 subagent 返回证据、由 Session 统一协调 tester / reviewer / devops；项目规则指针从 `CLAUDE.md` 改为 `AGENTS.md`；剔除旧 Codex 文件中对权威 skill 内容的重复展开。
- skill 映射：`test-driven-development`、`tdd-amendment-bug-fix`、`layered-diagnosis` 均由 `~/.claude/skills/` 映射至 `~/.codex/skills/`，3 个目标目录均存在。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`backend-dev.md` 与 `backend-dev.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/backend-dev.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/backend-dev.toml.bak-s3-20260716`。

### code-reviewer

- Claude 权威：`/Users/taoyawei/.claude/agents/code-reviewer.md`
- 行数：Codex Markdown `42 → 42`；TOML `41 → 41`
- 适配点：保留质量、正确性、安全、性能、可维护性检查维度及精简输出格式；将旧 Codex 文件中“E2E 全部通过后审查”的过期流程恢复为 Claude 现文的“开发自验绿后审查”，并保留小任务即审、Sprint 可与末轮 E2E 并行或其后的边界；补齐 Codex subagent 不二次派单与返回 Session 协调的载体边界。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`code-reviewer.md` 与 `code-reviewer.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/code-reviewer.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/code-reviewer.toml.bak-s3-20260716`。

### dba

- Claude 权威：`/Users/taoyawei/.claude/agents/dba.md`
- 行数：Codex Markdown `49 → 53`；TOML `48 → 52`
- 适配点：恢复 Claude 现文的单表百万行阈值表述和权威运维总览读取口径；保留数据库设计、DDL/迁移、文档维护、迁移执行职责；恢复“迁移完成按五源同步规则更新”和项目多源同步章节；项目规则指针由 `CLAUDE.md` 改为 `AGENTS.md`；跨角色通知全部改为返回 Session 统一协调。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`dba.md` 与 `dba.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/dba.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/dba.toml.bak-s3-20260716`。

### devops

- Claude 权威：`/Users/taoyawei/.claude/agents/devops.md`
- 行数：Codex Markdown `186 → 171`；TOML `185 → 170`
- 适配点：恢复 Claude 现文的权威运维总览、实时状态与项目数据维护手册读取口径；输出文档收敛回 `ops.md` / `status.md` / `data-maintenance-playbook.md`；删除重复且可能误导具体项目的通用 Gradle/Flutter 启动脚本，恢复“具体命令以 `docs/ops/ops.md` 为准”的教义；将示例中的 `CLAUDE_API_KEY` 载体专名适配为通用 `API_KEY` 与外部凭证说明；补齐 Codex subagent 不二次派单与返回 Session 协调边界。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、`CLAUDE_API_KEY`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`devops.md` 与 `devops.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/devops.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/devops.toml.bak-s3-20260716`。

### editor-in-chief

- Claude 权威：`/Users/taoyawei/.claude/agents/editor-in-chief.md`
- 行数：Codex Markdown `133 → 132`；TOML `132 → 131`
- 适配点：恢复 Claude 现文的 4-skill 工具箱，以 `fact-checking` 的 SIFT 章节统一承担信源核验并删除旧 `source-verification`；保留 Memento 聚合器作为 Archive.today 层内既有快照查询渠道；项目规则指针由 `CLAUDE.md` 改为 `AGENTS.md`；工程、数据库与测试协作统一返回 Session 调度，subagent 不二次派单。
- skill 映射：`news-pitch`、`fact-checking`、`news-writing`、`source-archiving` 均使用 `~/.codex/skills/` 下同名 skill，4 个目标 `SKILL.md` 均存在；不保留旧 `source-verification`。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、旧 `source-verification`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`editor-in-chief.md` 与 `editor-in-chief.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/editor-in-chief.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/editor-in-chief.toml.bak-s3-20260716`。

### flutter-dev

- Claude 权威：`/Users/taoyawei/.claude/agents/flutter-dev.md`
- 行数：Codex Markdown `79 → 94`；TOML `78 → 93`
- 适配点：恢复 Claude 现文的任务相关测试文档与权威运维总览读取口径，完整恢复 Flutter 数据层→逻辑层→展示层逐级自验、视觉证据触发边界和分层诊断要求；TDD 与 bug 修复指针改用 Codex skill；项目规则指针由 `CLAUDE.md` 改为 `AGENTS.md`；tester / reviewer / devops 协作统一返回 Session 调度。
- skill 映射：`test-driven-development`、`tdd-amendment-bug-fix`、`layered-diagnosis` 均由 `~/.claude/skills/` 映射至 `~/.codex/skills/`，3 个目标 `SKILL.md` 均存在。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`flutter-dev.md` 与 `flutter-dev.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/flutter-dev.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/flutter-dev.toml.bak-s3-20260716`。

### frontend-dev

- Claude 权威：`/Users/taoyawei/.claude/agents/frontend-dev.md`
- 行数：Codex Markdown `89 → 99`；TOML `88 → 98`
- 适配点：恢复 Claude 现文的任务相关测试文档、五项通用 UI 偏好、TDD / bug 修复权威指针、灰盒与冒烟定义、三级逐级自验和展示层视觉证据触发规则；Skill tool 表述改为读取并遵循 Codex 同名 skill；保留 Codex subagent 不二次派单与返回 Session 协调边界。
- skill 映射：`frontend-design`、`test-driven-development`、`tdd-amendment-bug-fix`、`browser-e2e-testing`、`layered-diagnosis` 均由 Claude skill 指针映射至 `~/.codex/skills/`，5 个目标 `SKILL.md` 均存在。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Skill tool 及 Claude 协作/任务/询问/后台工具名、Claude-only frontmatter 均无残留。
- 镜像：`frontend-dev.md` 与 `frontend-dev.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/frontend-dev.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/frontend-dev.toml.bak-s3-20260716`。

### product-manager

- Claude 权威：`/Users/taoyawei/.claude/agents/product-manager.md`
- 行数：Codex Markdown `57 → 57`；TOML `56 → 56`
- 适配点：完整保留竞品分析、需求延伸、版本定义、UE 交互设计、产品文档输出、无状态 PRD 与文档权限教义；Claude `SendMessage` 协作适配为 PM 将需求、成本与版本范围协调事项返回 Session，由 Session 使用 `send_message` / `followup_task` 协调 Scrum Master；Markdown 统一为 LF。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致，LF 与末尾换行一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`product-manager.md` 与 `product-manager.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/product-manager.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/product-manager.toml.bak-s3-20260716`。

### scrum-master

- Claude 权威：`/Users/taoyawei/.claude/agents/scrum-master.md`
- 行数：Codex Markdown `272 → 291`；TOML `271 → 290`
- 适配点：完整恢复 Claude 现文的 Session/独立 subagent 双运行形态、验收者 A 定位、唯一交付状态机、PM 轻量复核、API→浏览器双阶段、测试分工与状态表、业务锚点式派单、后台 agent 通知与停滞管理及新版 TDD 落地章节；`TaskCreate` / `TaskList` / `TaskUpdate` / `SendMessage` / `Agent` 操作分别映射为 Session 的 `update_plan`、`spawn_agent`、实质消息与现场跟踪、`send_message` / `followup_task` / `interrupt_agent`；独立 subagent 不二次派单。
- skill 映射：`acceptance-testing`、`browser-e2e-testing`、`test-driven-development`、`tdd-amendment-bug-fix` 均映射至 `~/.codex/skills/`，4 个目标 `SKILL.md` 均存在；Claude 现文的可选 `codex-delegate` skill 在 Codex 能力域不存在且该自我桥接无等价必要性，已删除对应可选预审小节并保留 PM 强制复核。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致，LF 与末尾换行一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、`TaskCreate` / `TaskList` / `TaskUpdate` / `SendMessage`、Claude 协作/询问/后台工具名、缺失 skill 指针及 Claude-only frontmatter 均无残留。
- 镜像：`scrum-master.md` 与 `scrum-master.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/scrum-master.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/scrum-master.toml.bak-s3-20260716`。

### tester

- Claude 权威：`/Users/taoyawei/.claude/agents/tester.md`
- 行数：Codex Markdown `265 → 281`；TOML `264 → 280`
- 适配点：完整恢复 Claude 现文的末轮验收交付状态机、前后端分列测试金字塔、API 白盒与视觉验收分界、TDD / bug 修复 skill 指针及生产环境禁止自动建用户、赋权和清理数据约束；全局规则指针由 `~/.claude/CLAUDE.md` 改为 `~/.codex/AGENTS.md`；`SendMessage` 协作改为返回 Session 统一协调，并保留 subagent 不二次派单边界。
- skill 映射：`acceptance-testing`、`browser-e2e-testing`、`layered-diagnosis`、`test-driven-development`、`tdd-amendment-bug-fix` 均映射至 `~/.codex/skills/`，5 个目标 `SKILL.md` 均存在。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、`SendMessage`、Claude 协作/任务/询问/后台工具名及 Claude-only frontmatter 均无残留。
- 镜像：`tester.md` 与 `tester.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/tester.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/tester.toml.bak-s3-20260716`。

### the-fool

- Claude 权威：`/Users/taoyawei/.claude/agents/the-fool.md`
- 行数：Codex Markdown `69 → 69`；TOML `68 → 68`
- 适配点：完整保留“不给项目背景驯化”的局外人身份，明确不读 PRD、架构、FACTS、勘探报告、`docs/`、代码或实现，只接收一句话需求与待评审方案，在产品逻辑、概念和前提层面提出 3–5 个天真但致命的问题且不给解决方案；剔除 Claude-only frontmatter，Codex subagent 继续保持不二次派单、返回 Session 统一协调的载体边界。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名、`Read` 等 Claude-only 工具声明及 Claude-only frontmatter 均无残留。
- 镜像：`the-fool.md` 与 `the-fool.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/the-fool.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/the-fool.toml.bak-s3-20260716`。

### the-pessimist

- Claude 权威：`/Users/taoyawei/.claude/agents/the-pessimist.md`
- 行数：Codex Markdown `78 → 78`；TOML `77 → 77`
- 适配点：完整保留读穿 PRD、架构、FACTS、勘探报告与相关代码的内行红队定位，以及 steelman、技术执行风险、可证伪证据、风险量表和 showstopper 最小缓解方向教义；Claude `Read` / `Grep` / `Glob` / `Bash` 载体表述改为使用读文件、`rg` 与必要只读命令核验事实；Codex subagent 不二次派单，依赖返回 Session 统一协调。
- skill 映射：仅有泛指“评审 skill”，无显式 skill 名称或路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名、`Read` / `Grep` / `Glob` / `Bash` 工具声明及 Claude-only frontmatter 均无残留。
- 镜像：`the-pessimist.md` 与 `the-pessimist.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/the-pessimist.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/the-pessimist.toml.bak-s3-20260716`。

### system-architect

- Claude 权威：`/Users/taoyawei/.claude/agents/system-architect.md`
- 行数：Codex Markdown `56 → 56`；TOML `55 → 55`
- 适配点：完整保留约束矩阵、3–5 个失败场景、技术选型原则和“架构师只定边界、不写实现”的角色教义，以及组件/数据流、模块职责、接口风格与实现细节之间的明确分工；剔除 `Read` / `Grep` / `Glob` / `WebSearch` / `WebFetch` 等 Claude-only frontmatter 工具声明；Codex subagent 不二次派单，依赖返回 Session 统一协调；Markdown 统一为 LF。
- skill 映射：无显式 skill 路径，无需映射或删除。
- TOML：wrapper schema 保持不变；`name` / `description` 与 Markdown frontmatter 一致；`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 残留检查：`~/.claude`、绝对 Claude 路径、项目 `CLAUDE.md`、Claude 协作/任务/询问/后台工具名、`Read` / `Grep` / `Glob` / `WebSearch` / `WebFetch` 工具声明及 Claude-only frontmatter 均无残留。
- 镜像：`system-architect.md` 与 `system-architect.toml` 已同步到仓库镜像并通过 byte compare。
- 备份：`/Users/taoyawei/.codex/agents/system-architect.md.bak-s3-20260716`；`/Users/taoyawei/.codex/agents/system-architect.toml.bak-s3-20260716`。

## 总体验证

- 角色集合：源侧与镜像侧均为 14/14 个 Markdown + 14/14 个 TOML，文件名集合完全一致；报告包含 14/14 个角色施工小节。
- 行数汇总：Markdown 由 1505 行变为 1525 行；TOML 由 1491 行变为 1511 行。汇总值与 14 条逐角色记录及源侧备份/现文实际行数一致。
- Wrapper 与格式：14/14 个 TOML 可解析且仅含 `name` / `description` / `developer_instructions`；14/14 个 `name` 、`description` 与 Markdown frontmatter 精确一致，`developer_instructions` 与去除 frontmatter 及分隔空行后的 Markdown 正文逐字一致。
- 镜像与备份：28/28 个正式文件源↔镜像 byte exact；28 个 `*.bak*` 仅存在于 `~/.codex/agents/`，仓库镜像中为 0，未跟踪、未暂存任何备份。
- Skill 存在性：`acceptance-testing`、`browser-e2e-testing`、`test-driven-development`、`tdd-amendment-bug-fix`、`layered-diagnosis`、`frontend-design`、`news-pitch`、`fact-checking`、`news-writing`、`source-archiving` 的 `~/.codex/skills/<name>/SKILL.md` 全部存在；其中角色文件内所有显式 `~/.codex/skills/<name>` 路径均有有效目录。
- `scrum-master`：本机不存在 `~/.codex/skills/codex-delegate`，已删除对该缺失 skill 的可选预审小节；当前 Markdown/TOML 中 `codex-delegate` 均为 0，PM 强制轻量复核保留。
- 全局残留检查：对源侧全部正式 `*.md` / `*.toml`（排除 `*.bak*`；镜像已 byte exact）执行 `rg -n --pcre2` 联合口径：`~/.claude`、绝对 `.claude` 目录、`CLAUDE.md`、`SendMessage`、`TaskCreate|TaskList|TaskUpdate`、`AskUserQuestion`、`run_in_background`、`WebSearch|WebFetch`、反引号中的 `Read|Grep|Glob|Bash|Agent|Skill|Task` 及 `tools|disallowedTools` frontmatter；结果 0。口径仅匹配明确的 Claude-only 工具标记，不误报普通小写 `agent` / `skill` 语义。
- 编辑专项：`editor-in-chief.md` 与 `.toml` 中 `source-verification` 共 0 处，不再保留旧 skill 指针。
- rsync：已从 `~/.codex/agents/` 到 `codex/agents/` 真实执行一次不带 `--delete` 的同步，显式排除 `*.bak*`、`.DS_Store`、隐藏项、`cache/` 与 `__pycache__/`；28 个正式文件均纳入同步，同步后再次验证 28/28 byte exact。
- 审查与收口：独立审查结论 PASS，本轮复核同样 PASS；本报告只收口 S3b，未处理的后续内容保留给 S3c / S4。
