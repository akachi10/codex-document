# S1：`~/.codex` 配置三分类映射表

## 口径

- 调查时间：2026-07-16（America/Los_Angeles）。
- 本表是后续移植的施工索引，不做语言细审，也不复述规则全文。
- Codex 当前源：`~/.codex/AGENTS.md`；Claude 当前权威源：`~/.claude/CLAUDE.md`（本轮实读 238 行版本）。
- 分类定义：
  1. **镜像内容**：教义以 Claude 当前文件为权威，移植时只做 Codex 路径、工具名与 Session 语义适配。
  2. **Codex 专属内容**：Claude 没有等价本体，标记为**保留待升审**；后续只有明确更好时才改。
  3. **僵尸内容**：已废弃机制、与当前权威冲突的旧流程、失去权威归属的重复展开或无效引用，后续删除而非移植。
- 路径使用稳定锚点，优先写“文件 + 章节名”，不以易漂移的行号作为唯一依据。

## 一、`AGENTS.md` 按章节映射

### ① 镜像内容

| Codex 当前章节/关键块 | Claude 权威源 | 后续施工动作 |
|---|---|---|
| `规则与知识的层级体系`：四层结构、无系统动态记忆、禁止项目级 skill | `~/.claude/CLAUDE.md` → `规则与知识的层级体系（系统级规范）` | 以 Claude 短版为骨架，替换为 `~/.codex` / `AGENTS.md` 路径；保留 Codex 不具备系统 auto memory 的事实适配。 |
| `默认无状态与持久化纪律` | `~/.claude/CLAUDE.md` → `动态记忆写入纪律（强制）` | 移植“先判层、尽量不堆叠”教义；Codex 的无状态语义作为载体适配，不重新讨论教义。 |
| `工作区破坏性操作` → `回退 = 参考旧版本手动改回去` | `~/.claude/CLAUDE.md` → 同名章节 | 直接镜像；路径和命令语义无需改变。 |
| `编码规范` → `避免重复实现` | `~/.claude/CLAUDE.md` → `避免重复实现（最高优先级）` | 整体更新；补入 Claude 新版“动手前先调查已实现/部分实现/未实现”，将 Claude `Explore` 适配为最合适的只读 Codex subagent。 |
| `Default-Value Overload` | `~/.claude/CLAUDE.md` → `避免重复实现（最高优先级）` 内同名原则 | 直接镜像，只保留一份业务实现的教义。 |
| `通用方法索引` | `~/.claude/CLAUDE.md` → `通用方法索引（强制）` | 直接镜像短版。 |
| `数据库设计必须范式化` | `~/.claude/CLAUDE.md` → 同名章节 | 直接镜像。 |
| `项目文档规范` → `双目录体系` | `~/.claude/CLAUDE.md` → `项目文档规范 / 双目录体系` | 直接镜像。 |
| `启动行为` | `~/.claude/CLAUDE.md` → `项目文档规范 / 启动行为` | **整体替换**为按需读取：项目入口 + 全部 `human/*.md` + `docs/` 索引/总览和当前任务相关文档；删除“一次性全读所有 docs”。 |
| `上下文压缩恢复` | `~/.claude/CLAUDE.md` → `项目文档规范 / 启动行为` | 与启动行为合并；保留“压缩后必须回读文件确认、不可凭记忆行动”，不再维护第二套重复步骤。 |
| `human 目录规则` | `~/.claude/CLAUDE.md` → 同名章节 | 镜像短版：只读、禁止创建、冲突上报。 |
| `docs 目录规则` | `~/.claude/CLAUDE.md` → 同名章节 | 镜像短版：AI 工作区、结构清晰、及时更新。 |
| `开发协作模式` → `连续判断链不拆` | `~/.claude/CLAUDE.md` → 同名章节 | 移植“信息增益依赖”定义；Claude 后台通知协议只移植教义，执行载体改用 Codex `spawn_agent` / `send_message` / `followup_task` / `wait_agent`。 |
| Codex 当前缺失：`协作节奏：问题前置，推进不回头` | `~/.claude/CLAUDE.md` → `协作节奏：问题前置，推进不回头（强制）` | **新增镜像块**：规划期集中拍板，执行期不重开已定方案，讨论收口后一次落稿，状态随真实进度同步。 |
| `敏捷模式（session 主导）` | `~/.claude/CLAUDE.md` → 同名章节 | 用 Claude 当前短版整体替换现有长版；角色路径改为 `~/.codex/agents/<角色>.md`。 |
| `共享规则` → `滚动开发流程` | `~/.claude/CLAUDE.md` → `共享规则 / 滚动开发流程` | 用当前精简流程替换旧 ASCII 流程图；角色与职责细节下沉角色文件。 |
| `视觉校验 / 浏览器 E2E 触发规则` | `~/.claude/CLAUDE.md` → `共享规则 / 滚动开发流程` | 镜像“小任务默认跳过、大任务末轮统一、失败退出阀、模块/Sprint 完成口径”。 |
| Codex 当前流程中的交付顺序 | `~/.claude/CLAUDE.md` → `共享规则 / 滚动开发流程 / 唯一交付状态机` | **整体替换**为唯一状态机：模块自验 → 模块 code-review → 全模块完成 → 末轮 E2E（如触发）→ E2E 修复 diff 再 review → 收口。 |
| `小任务快速通道` | `~/.claude/CLAUDE.md` → 同名章节 | 镜像一句话版本：最合适开发者 → code-reviewer；E2E 仅按触发规则执行。 |
| `验收流程` 的系统级摘要 | `~/.claude/CLAUDE.md` → `共享规则 / 验收流程（强制）` | 用 Claude 当前三条铁律替换现有全量展开；方法论权威下沉 `acceptance-testing`，浏览器工具书下沉 `browser-e2e-testing`。 |
| `核心原则`：先测后实现 | `~/.claude/CLAUDE.md` → `共享规则 / 核心原则` | 镜像当前摘要；TDD 权威指向 `test-driven-development`。 |
| `核心原则` 中的黄测说明 | `~/.claude/CLAUDE.md` → `共享规则 / 核心原则` | 更新为新版摘要：黄测用于 bug 修复与完工后主动探雷，DB 状态断言适用于全部集成测试；复现探测器、测试冻结、双绿收口等完整语义由 `~/.claude/skills/tdd-amendment-bug-fix/` 在后续 skill 移植批次提供。 |
| `核心原则`：最小模块、不过度设计、文档/前端规范先行 | `~/.claude/CLAUDE.md` → `共享规则 / 核心原则` | 镜像合并版，删除重复职责细节。 |
| `通用规则` → 判断实现状态 | `~/.claude/CLAUDE.md` → 同名章节 | 直接镜像“读代码 > 跑测试 > 询问用户”。 |
| `无状态文档原则` | `~/.claude/CLAUDE.md` → 同名章节 | 镜像短版。 |
| `文档目录结构与权限` | `~/.claude/CLAUDE.md` → 同名章节 | 以 Claude 当前表格为权威替换 ASCII 树。 |
| `文档规范` | `~/.claude/CLAUDE.md` → 同名章节 | 镜像三条短版。 |
| `角色 Memory 规则` | `~/.claude/CLAUDE.md` → 同名章节 | 路径与 auto-memory 能力按 Codex 实际适配；保留“角色不写全局记忆、持久信息进正式 docs”教义。 |

### ② Codex 专属内容

| Codex 专属章节/关键块 | 分类结论 | 后续施工动作 |
|---|---|---|
| `用户环境 / Codex 运行路径`（除 `teams/` 行） | **保留待升审** | Codex 配置入口、skills、agents 路径是本体；只做压缩和准确性复核。 |
| `用户环境 / 常用路径` | **保留待升审** | Claude 无对应系统本体；保留用户工作环境索引，后续判断是否应下沉项目/工具说明。 |
| `工作授权与沟通纪律 / 区分表达、提问与执行授权` | **保留待升审** | Codex 专属授权边界；与新版“问题前置、推进不回头”消重，但不得削弱授权语义。 |
| `Skill 使用规则` 的触发、读取、依赖失败处理 | **保留待升审** | Codex skill 发现与执行契约；后续改为最小权威说明，避免复制单个 skill 方法论。 |
| `Skill 使用规则 / 重要 skill` 快速索引（除已单列的 gstack） | **保留待升审** | Claude 全局文件无同类索引；仅作 Codex 能力路由，实际保留/合并结论以后续 skills 目录批次为准。 |
| `Codex 能力追索规则` | **保留待升审** | 保留只在 Codex skills、agents、插件中追索等价能力的边界。 |
| `角色文件与 subagent 规则` 的角色模板说明 | **保留待升审** | Codex 角色不是自动注册 agent 的运行事实；保持准确即可。 |
| `Session 调度者原则` | **保留待升审** | 保留 Session 拆解、派单、整合、最终验收责任；吸收“全员平权”时只改协作载体，不把角色结论当最终事实。 |
| `subagent 派发规则` | **保留待升审** | 保留先读角色文件、prompt 最小字段、写入边界、Session 复核；工具名统一为 Codex 原生协作机制。 |
| `外部引擎桥接边界` | **保留待升审** | Claude 的“双引擎 subagent”不直接镜像到 Codex；Codex 仍以原生 subagent 为默认，是否桥接 Claude 服从 Codex 自身授权边界。 |

### ③ 僵尸内容

| Codex 当前僵尸块 | 证据/原因 | 后续施工动作 |
|---|---|---|
| `用户环境 / Codex 运行路径` 中 `~/.codex/teams/` | 目录当前为空；Claude 新版已删除团队模式 | 删除路径条目。 |
| `启动行为` 与 `上下文压缩恢复` 中 team config 恢复步骤 | 依赖已废弃团队模式；当前没有有效 team 状态 | 删除。 |
| `Session 调度者原则` 末句“团队模式和用户点名角色……”中的团队模式分支 | 已无团队模式权威 | 删除团队模式半句，保留用户点名角色的正常边界。 |
| `开发协作模式` 开头“两种开发协作模式”声明 | Claude 当前只有 session 主导敏捷模式 + 通用 subagent 协作 | 删除并重写章节引言。 |
| `团队模式（并行协作）` 全章：扫描编号、等待输入、team_name/config、同轮启动仪式 | Claude 新版已删除；`~/.codex/teams/` 无有效状态；普通并行已由 Session 调度原则覆盖 | 整章删除，不迁移。 |
| `共享规则（两种模式通用）` 中“两种模式”限定 | 所依赖的团队模式已删除 | 改为无模式限定的 `共享规则`。 |
| `共享规则 / 角色列表` 与 `评审专用角色` 全局花名册 | Claude 新版已删除；角色定义应以 `~/.codex/agents/*.md` 为权威，固定表会漂移 | 删除全局重复表。 |
| `共享规则 / 滚动开发流程` 的旧 ASCII 图 | 先逐模块 E2E、后 code-review，与新版唯一交付状态机冲突 | 删除旧图，由 Claude 当前短流程 + 唯一状态机替换。 |
| `状态记录机制 / 任务状态表格模板` | Claude 新版已删除；固定仪式与任务真实状态易脱节，具体跟踪归 scrum-master | 删除系统级模板。 |
| `测试分工` 全表 | Claude 新版已删除；与角色文件及验收 skill 重复，且包含固定技术栈用语 | 删除系统级重复展开。 |
| `验收流程` 当前十余条细则 | Claude 当前只保留系统级铁律，完整方法论已转为 `acceptance-testing` 权威 | 删除重复细则，以 Claude 三条摘要替换。 |
| `E2E 测试用户获取顺序` | Claude 新版系统规则已删除；账号/生产数据边界应由 tester 与验收工具书统一定义，当前“自动创建并赋权”缺少环境分支 | 从全局 AGENTS 删除，后续以新版验收教义为唯一权威。 |
| `Skill 使用规则 / 重要 skill` 中 `gstack` 推荐项 | Claude 侧已移除 gstack；浏览器验收已有 `acceptance-testing` + `browser-e2e-testing` 权威链 | 从全局推荐表删除；Codex 本地目录是否保留由 skills 批次单独裁决。 |

### 覆盖核对

- 一级章节覆盖：`用户环境`、`工作授权与沟通纪律`、`规则与知识的层级体系`、`工作区破坏性操作`、`编码规范`、`项目文档规范`、`Skill 使用规则`、`角色文件与 subagent 规则`、`开发协作模式`，共 **9/9**。
- 施工表项：镜像 **28** 项、Codex 专属 **10** 项、僵尸 **13** 项。
- 关键新版锚点已入表：按需启动、问题前置推进不回头、唯一交付状态机、黄测新摘要、团队模式删除。

## 二、`agents/` 文件映射

### 文件名口径与数量

- 本节只比较 `~/.codex/agents/` 与 `~/.claude/agents/` 的一级目录项、扩展名和文件元数据，未读取角色正文；内容差异留到 S3。
- 正式角色只计不带 `.bak*` 后缀的 `*.md`：Codex **14** 个、Claude **14** 个，交集 **14** 个，Claude-only **0** 个，Codex-only **0** 个。
- 用户所称“15 个角色”按当前磁盘事实应理解为 **14 个正式角色文件 + 1 个由全局规则定义、没有独立角色文件的 Session 协调者身份**；当前不存在应补造的第 15 个角色文件。
- Codex 另有与 14 个角色同名的 **14 个 `*.toml`**；Claude 侧没有对应文件。

### ① 镜像内容（疑似，S3 细查）

| Codex 目标 | Claude 权威源 | 文件名层结论 |
|---|---|---|
| `~/.codex/agents/backend-designer.md` | `~/.claude/agents/backend-designer.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/backend-dev.md` | `~/.claude/agents/backend-dev.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/code-reviewer.md` | `~/.claude/agents/code-reviewer.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/dba.md` | `~/.claude/agents/dba.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/devops.md` | `~/.claude/agents/devops.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/editor-in-chief.md` | `~/.claude/agents/editor-in-chief.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/flutter-dev.md` | `~/.claude/agents/flutter-dev.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/frontend-dev.md` | `~/.claude/agents/frontend-dev.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/product-manager.md` | `~/.claude/agents/product-manager.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/scrum-master.md` | `~/.claude/agents/scrum-master.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/system-architect.md` | `~/.claude/agents/system-architect.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/tester.md` | `~/.claude/agents/tester.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/the-fool.md` | `~/.claude/agents/the-fool.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |
| `~/.codex/agents/the-pessimist.md` | `~/.claude/agents/the-pessimist.md` | 同名正式角色，疑似镜像；S3 再查正文差异。 |

Claude-only 与 Codex-only 的正式角色均为空，因此本轮没有“待移植”或“Codex 专属角色文件”条目。

### ② Codex 专属内容

| Codex 专属资产 | 分类结论 | 后续施工动作 |
|---|---|---|
| `~/.codex/agents/{14 个正式角色名}.toml` | **保留待升审** | Codex runtime wrapper；S3 只核对它与角色 `*.md` 的生成/同步关系，不因 Claude 侧无对应文件而删除。 |
| Session 协调者身份 | **保留待升审** | 由 `~/.codex/AGENTS.md` 的 Session 调度规则定义，不创建虚构的第 15 个角色文件。 |

### ③ 僵尸内容

| 文件级资产 | 文件名证据 | 后续施工动作 |
|---|---|---|
| `~/.claude/agents/*.md.bak-*` | 当前共 **26** 个：`bak-fable` 14 个、`bak-r2` 6 个、普通日期备份 6 个 | 全部是备份副本，不是权威角色，不移植、不纳入 Codex 镜像。 |

文件名层未发现隐藏运行时文件、缓存文件、Codex 备份或没有对端的正式角色。角色正文中是否引用不存在路径不属于本批次的读取范围，留到 S3 逐文件检查。

## 三、`skills/` 目录映射

### 扫描口径与集合统计

- 本节只扫描 `~/.codex/skills/` 与 `~/.claude/skills/` 的顶层目录名、顶层入口文件是否存在及必要文件类型元数据；没有读取任何 `SKILL.md` / `skill.md` / `instructions.md` 正文，也没有展开 `gstack` 或 `.system` 子目录。
- Codex 顶层 skill 目录 **37** 个，Claude 顶层 skill 目录 **27** 个；同名交集 **22** 个，Codex-only **15** 个，Claude-only **5** 个。
- 同名 22 项中，21 项两侧的实际顶层入口文件名均为 `SKILL.md`，`post-compact` 两侧均以 `instructions.md` 为入口；本机文件系统大小写不敏感，不能把小写路径解析结果误计为第二份文件。正文差异留到 S3。

### ① 镜像内容（疑似，S3 细查）

以下条目仅因顶层目录同名而列为疑似镜像；Claude 侧目录是后续正文移植的权威源，S1 不对内容是否相同作判断。

| Codex 目标 | Claude 权威源 | 目录名层结论 |
|---|---|---|
| `~/.codex/skills/acceptance-testing` | `~/.claude/skills/acceptance-testing` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/browser-e2e-testing` | `~/.claude/skills/browser-e2e-testing` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/claude-api` | `~/.claude/skills/claude-api` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/dispatch-briefing` | `~/.claude/skills/dispatch-briefing` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/fact-checking` | `~/.claude/skills/fact-checking` | 同名；Claude 当前目录承接已并入的 `source-verification` 能力，S3 细查。`gstack` 未并入其中。 |
| `~/.codex/skills/frontend-design` | `~/.claude/skills/frontend-design` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/knowledge-decompose` | `~/.claude/skills/knowledge-decompose` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/layered-diagnosis` | `~/.claude/skills/layered-diagnosis` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/mcp-builder` | `~/.claude/skills/mcp-builder` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/news-pitch` | `~/.claude/skills/news-pitch` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/news-writing` | `~/.claude/skills/news-writing` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/post-compact` | `~/.claude/skills/post-compact` | 同名运行载体；两侧入口均为 `instructions.md`，S3 细查。 |
| `~/.codex/skills/project-bootstrap` | `~/.claude/skills/project-bootstrap` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/quote-verification` | `~/.claude/skills/quote-verification` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/recursive-think` | `~/.claude/skills/recursive-think` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/source-archiving` | `~/.claude/skills/source-archiving` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/tdd-amendment-bug-fix` | `~/.claude/skills/tdd-amendment-bug-fix` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/tech-council-review` | `~/.claude/skills/tech-council-review` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/test-driven-development` | `~/.claude/skills/test-driven-development` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/webapp-testing` | `~/.claude/skills/webapp-testing` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/word-drill` | `~/.claude/skills/word-drill` | 同名，疑似镜像；S3 细查。 |
| `~/.codex/skills/xlsx` | `~/.claude/skills/xlsx` | 同名，疑似镜像；S3 细查。 |

### ② Codex 专属内容

| Codex-only 目录 | 分类结论 | 名称层判定与后续动作 |
|---|---|---|
| `~/.codex/skills/.system` | **Codex 专属，保留待升审** | Codex 系统托管 skill 容器；Claude 无同名本体，不移植、不在 S1 展开。 |
| `~/.codex/skills/claude-delegate` | **Codex 专属，保留待升审** | Codex → Claude 的方向性桥接；与 Claude-only 的反向桥 `codex-delegate` 不是镜像关系。 |
| `~/.codex/skills/codex-usage` | **Codex 专属，保留待升审** | Codex 用量查询能力；Claude 无同名本体。 |

### ③ 僵尸内容

#### 已裁决退出的独立目录

| Codex-only 目录 | 判定依据 | 后续动作 |
|---|---|---|
| `~/.codex/skills/gstack` | 无人使用的孤儿路由；Claude 当前顶层目录已直接删除，未并入 `fact-checking` | 僵尸；后续删除独立目录，不逐项复审其子目录。 |
| `~/.codex/skills/source-verification` | Claude 当前顶层目录已删除，且用户明确裁决其能力并入 `fact-checking` | 僵尸；后续删除独立目录。 |
| `~/.codex/skills/amesh` | 2026-07-04 单独退役，不属于“用户裁决移除的 10 个官方 skill”批次 | 僵尸；后续删除独立目录。 |

#### Claude 当前目录已移除的 10 个 skill

协调者确认该批次总数为 **10 个**。S1 原始名称扫描只明确记录了下列 **9 个**；`amesh` 已按 2026-07-04 单独退役移出本批次。第 10 个名称未由本报告现有证据建立，故不擅自补造，待 skills 施工批次依据权威裁决清单补齐。下列项目的分类依据统一为：**Claude 当前顶层目录已移除 + 用户已裁决这批官方 skill 移除**。

| Codex-only 目录 | 分类结论 |
|---|---|
| `~/.codex/skills/algorithmic-art` | 僵尸 |
| `~/.codex/skills/brand-guidelines` | 僵尸 |
| `~/.codex/skills/canvas-design` | 僵尸 |
| `~/.codex/skills/doc-coauthoring` | 僵尸 |
| `~/.codex/skills/find-skills` | 僵尸 |
| `~/.codex/skills/internal-comms` | 僵尸 |
| `~/.codex/skills/slack-gif-creator` | 僵尸 |
| `~/.codex/skills/theme-factory` | 僵尸 |
| `~/.codex/skills/web-artifacts-builder` | 僵尸 |

#### 隐藏元数据与运行垃圾

| 顶层资产 | 分类结论 | 后续动作 |
|---|---|---|
| `~/.codex/skills/**/.DS_Store` | 僵尸 | 扫描深度内共 **5** 个 Finder 元数据文件，删除且不纳入镜像。 |
| `~/.claude/skills/**/.DS_Store` | 僵尸 | 扫描深度内共 **2** 个 Finder 元数据文件，不移植。 |
| `~/.claude/skills/*/*.bak*`（含 `.claude/` 元数据备份） | 僵尸 | 扫描深度内共 **22** 个备份文件；均不是当前权威入口，不移植。 |

两侧顶层均未发现备份或缓存目录；本表只额外统计各 skill 直接子级中的 `.DS_Store` 与 `*.bak*`，更深层运行产物不在本次目录名扫描范围内。

### Claude-only 目录

| Claude-only 目录 | 名称层判断 | 后续动作 |
|---|---|---|
| `~/.claude/skills/.claude` | Claude 私有元数据目录 | Claude 专属，不移植。 |
| `~/.claude/skills/codex-delegate` | Claude → Codex 的反向桥接 | Claude 专属，不移植；Codex 侧已有方向相反的 `claude-delegate`。 |
| `~/.claude/skills/docx` | Claude 当前新增/保留能力，Codex 无同名顶层目录 | **不新增镜像**：未被需要，越少越有强度。 |
| `~/.claude/skills/pdf` | Claude 当前新增/保留能力，Codex 无同名顶层目录 | **不新增镜像**：未被需要，越少越有强度。 |
| `~/.claude/skills/skill-creator` | Claude 当前新增/保留能力，Codex 无同名顶层目录 | **不新增镜像**：未被需要，越少越有强度。 |

### 统计与 S3 边界

| 集合 | 数量 | S1 结论 |
|---|---:|---|
| 同名目录 | 22 | 全部列为“镜像内容（疑似，S3 细查）”并标注 Claude 权威源路径。 |
| Codex-only | 15 | 3 个 Codex 专属保留待升审；`gstack` 为直接删除的孤儿路由，`source-verification` 并入 `fact-checking`，`amesh` 于 2026-07-04 单独退役；官方移除批次按协调者裁决为 10 个，当前表有 9 个具名项，缺名不补造。集合口径将在 skills 施工批次按权威清单校正。 |
| Claude-only | 5 | 2 个 Claude 专属不移植；`docx`、`pdf`、`skill-creator` 3 个未被需要，不新增镜像。 |

S1 到此只建立章节名、角色文件名、skill 目录名三级施工索引。S3 才逐一读取正文，处理镜像差异、Codex 工具与 Session 语义适配及入口文件去重；Claude-only 的 `docx`、`pdf`、`skill-creator` 已裁决为不新增镜像。
