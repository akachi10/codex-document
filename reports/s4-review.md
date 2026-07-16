# S4：Codex 专属内容理解后语言／逻辑升审

## 范围、门槛与并发隔离

- 本轮对象：`~/.codex/AGENTS.md` 的 10 个 Codex 专属保留块，以及 `claude-delegate`、`codex-usage` 两个专属 skill；`.system` 是系统托管容器，不审不改。
- 改动门槛：先写理解摘要，只有能明确证明新表达更准确、更少歧义、逻辑更顺或更短且不丢信息时才改；拿不准、仅属同义替换或口语雅化的一律沿用。
- 关键逻辑保护：执行授权语义、能力追索边界、外部引擎桥接边界和 Session 最终验收责任只列建议，未经协调者裁决不改。
- 并发候选隔离：开工时仓库已有其他 worker 的未提交候选。本报告仅把 S4 明确授权的修改归入本轮；不覆盖、不暂存、不回滚，也不把其他 worker 的差异归因到 S4。尤其保护 `codex/AGENTS.md` 约第 70、241、305 行的既有未知 hunks。
- A 组改前备份：在报告先落盘后创建 `~/.codex/AGENTS.md.bak-s4-20260716`；源文件与备份均为 `346` 行，SHA-256 均为 `0ebe0afe0ddffa8bf6380292b18da8ae4e8cef2a9e0a67bbdee7a852fd2fbb9f`，`cmp` 验证一致，且未覆盖既有文件。

## AGENTS.md 专属内容

### 1. Codex 运行路径

#### 理解摘要

- **意图**：提供三个稳定的 Codex 配置入口。
- **约束对象**：Session 与其派发的 subagent。
- **与其他章节关系**：分别指向全局规则、Skill 使用规则及角色模板／派发规则。
- **完成判据**：执行者能定位规则入口、skill 根目录和角色模板根目录，并理解角色文件不是自动注册的 agent。

#### 引用与机制有效性

- 三条路径定义见 `~/.codex/AGENTS.md:7-9`，现场均存在。
- 角色文件真实机制见 `~/.codex/AGENTS.md:182-184`：它们是 prompt 模板，不自动注册，由 Session 读取后派发。
- S3a 已删除退役的 `teams/` 条目，见 `reports/s3a-agentsmd.md:16`。

#### 已改清单

- **已改**（修改后见 `~/.codex/AGENTS.md:9`，仓库镜像目标文本一致）
  - 原文：`Codex 角色定义文件，用于 session 派发 subagent`
  - 新文：`Codex 角色 prompt 模板，供 Session 读取后派发 subagent`
  - 明确更好理由：说明文件不是注册机制，也不是文件本身派单；与后文运行事实完全一致。

#### 沿用决定

- `AGENTS.md` 和 `skills/` 两行已经准确、简短，沿用。
- 绝对路径是用户环境本体，不改为变量或相对路径。

#### 关键逻辑升审建议

- 无。

### 2. 常用路径

#### 理解摘要

- **意图**：把“看 BUG 截图”映射到固定截图目录。
- **约束对象**：收到该用户表达的 Session／subagent。
- **与其他章节关系**：这是环境路由，不承担验收截图规则；验收证据仍由验收章节和 skill 管理。
- **完成判据**：触发后找到该目录最新的有效截图文件。

#### 引用与机制有效性

- 规则见 `~/.codex/AGENTS.md:11-15`。
- `/Users/taoyawei/documents/Xnip` 现场存在；审查时目录内只有 `.DS_Store`，所以路径有效，但当时没有可读截图。

#### 已改清单

- **已改**（修改后见 `~/.codex/AGENTS.md:15`，仓库镜像目标文本一致）
  - 原文：`截图工具路径，用户说"看 BUG 截图"时查看此目录最新文件`
  - 新文：`截图存放目录；用户说‘看 BUG 截图’时，查看其中最新的截图文件`
  - 明确更好理由：“截图工具路径”容易被理解成应用安装路径；实际动作针对截图文件目录，新文也排除了把 `.DS_Store` 等非截图文件当作“最新文件”的歧义。

#### 沿用决定

- 路径和触发语句均明确，沿用。

#### 关键逻辑升审建议

- 无。

### 3. 工作授权与沟通纪律

#### 理解摘要

- **意图**：先区分执行请求、只读问答、方向表达和边界不清，再决定能否改变状态。
- **约束对象**：Session 及继承相同授权边界的 subagent。
- **与其他章节关系**：它是进入规划或执行前的授权闸；“问题前置，推进不回头”只在获得相应授权后约束规划期和执行期节奏。
- **完成判据**：每个请求先得到明确分类；只在授权范围内执行，存在实质歧义时先确认。

#### 引用与机制有效性

- 总边界及五类规则见 `~/.codex/AGENTS.md:19-31`。
- “问题前置，推进不回头”见同文件 `:246-254`。
- Session 不扩大授权见同文件 `:195`。
- S1／S3a 均要求此处与新协作节奏消重但不得削弱授权语义，见 `reports/s1-mapping.md:55`、`reports/s3a-agentsmd.md:17`。

#### 已改清单

- 无。执行授权语义属于本轮禁止直接修改的关键逻辑。

#### 沿用决定

- 五类规则各自有触发和动作，整体顺序清楚。
- 不与“问题前置”合并：前者回答“有没有权限开始”，后者回答“获得权限后如何推进”，不存在重复。

#### 关键逻辑升审建议

1. `AGENTS.md:27` 以出现动作词和对象作为“明确执行请求”的判据，可能把假设句、引用句或背景叙述误判为授权，与 `:23` 的总原则存在边缘张力。建议协调者裁决是否增加“具有直接请求／命令语义”这一必要条件；本次不改。
2. `:23` 将“偏好、背景信息、反馈”列为不构成授权，但 `:29` 的方向表达示例只覆盖未来计划／倾向。建议协调者裁决是否显式说明这三类也按非执行信息处理；本次不改。

### 4. Skill 使用规则节首正文

#### 理解摘要

- **意图**：定义 skill 的强制触发、入口读取、按需加载和依赖缺失处理。
- **约束对象**：所有执行 skill 的 Session／subagent。
- **与其他章节关系**：快速索引负责路由；能力追索负责缺失能力的搜索边界；各 skill 正文负责具体输出和验证契约。
- **完成判据**：正确触发、读取入口、遵守职责／工具／输出契约，并对缺失依赖形成替代或明确阻塞结论。

#### 引用与机制有效性

- 规则见 `~/.codex/AGENTS.md:145-156`。
- skill 根目录及当前索引的七个 `SKILL.md` 均现场存在。

#### 已改清单

1. **已改**（修改后见 `~/.codex/AGENTS.md:154`，仓库镜像目标文本一致）
   - 原文：`深入理解触发条件、职责边界、工具要求、输出要求`
   - 新文：`确认并遵循触发条件、职责边界、工具要求和输出要求`
   - 明确更好理由：“理解”只描述认知动作；“确认并遵循”明确执行义务及完成条件，未增加新教义。
2. **已改**（修改后见 `~/.codex/AGENTS.md:156`，仓库镜像目标文本一致）
   - 原文：`如果 skill 依赖 MCP 或外部命令但 Codex 当前不可用，说明阻塞并使用最合适的替代方案`
   - 新文：`如果 skill 依赖的 MCP 或外部命令当前不可用，先说明能力缺口；仅在不改变职责边界和输出契约时使用替代方案，否则报告阻塞`
   - 明确更好理由：原文同时要求“阻塞”和“使用替代方案”，状态矛盾；新文明确可替代与真正阻塞的分界。

#### 沿用决定

- 强制触发条件、先读入口和按需读取资源三项准确且与当前 skill 机制一致，沿用。

#### 关键逻辑升审建议

- 无；第二项不改变能力追索域，只修正依赖失败处理的状态语义。

### 5. 重要 skill 索引

#### 理解摘要

- **意图**：为高频、强制性方法提供快速触发路由，不复制 skill 正文。
- **约束对象**：决定是否加载 skill 的 Session／subagent。
- **与其他章节关系**：受节首强制触发规则约束；验收、TDD 和前端规则还在共享规则中引用这些 skill。
- **完成判据**：表内 skill 均真实存在，触发描述不窄于权威正文，且不引用归档能力。

#### 引用与机制有效性

- 索引见 `~/.codex/AGENTS.md:158-168`。
- 七个目录及 `SKILL.md` 均现场存在。
- 12 个僵尸 skill 已归档，见 `reports/s3c-skills.md:239-256`；索引曾唯一命中的 `find-skills` 已移除并复扫为零，见同报告 `:258-263`。本次对 AGENTS 复扫 12 个归档名称仍为零。
- TDD 权威触发包括功能、Bug、重构、行为变更，见 `skills/test-driven-development/SKILL.md:16-27`；全局强制应用见 `AGENTS.md:303-305`。
- amendment 要求与基础 TDD 一并应用并包含完工后主动探雷，见 `skills/tdd-amendment-bug-fix/SKILL.md:10-16,32-39`。

#### 已改清单

1. **已改**（修改后见 `~/.codex/AGENTS.md:166`，仓库镜像目标文本一致）
   - 原文：`test-driven-development | 明确要求 TDD、先写测试、测试驱动开发时`
   - 新文：`test-driven-development | 功能开发、Bug 修复、重构或行为变更，写实现代码前`
   - 明确更好理由：当前索引把强制触发误写成只有用户明确点名 TDD 才触发；新文与 skill 权威描述及全局核心原则一致。
2. **已改**（修改后见 `~/.codex/AGENTS.md:167`，仓库镜像目标文本一致）
   - 原文：`tdd-amendment-bug-fix | 白盒 bug 修复、需要黄色测试复现当前错误和 DB 状态断言时，与 TDD skill 同用`
   - 新文：`tdd-amendment-bug-fix | 引用 test-driven-development 时一并应用：白盒 Bug 修复黄测、集成测试 DB 状态断言、完工后主动探雷`
   - 明确更好理由：补齐权威正文的“一并应用”和第二触发，避免漏掉主动探雷。
3. **已改**（修改后见 `~/.codex/AGENTS.md:168`，仓库镜像目标文本一致）
   - 原文：`layered-diagnosis | 需要分层定位复杂问题、从现象拆到数据/接口/实现/环境层时`
   - 新文：`layered-diagnosis | 功能测试、Bug 复现/排查，或修改跨 DB/后端/前端故障前，先分层定位`
   - 明确更好理由：当前“复杂问题”比 skill 权威触发范围窄；新文明确何时触发及先定位再修改的动作。

#### 沿用决定

- `acceptance-testing`、`browser-e2e-testing`、`frontend-design`、`tech-council-review` 四行与各自 frontmatter／适用场景一致，已足够短，沿用。
- 不把各 skill 的完整流程搬进索引，避免与权威正文重复。

#### 关键逻辑升审建议

- 无。

## A 组施工校验

- 源文件修改后仍为 `346` 行，SHA-256 为 `f7cfd505a4b13419e6a4716fa30a6d82903f45964cd4eaa9c4b4269c138fee89`。
- `diff` 对比改前备份只出现本报告列出的 `7` 行一对一替换；对象 3 授权语义及 A 组目标外的源文件内容均未变化。
- 两个 AGENTS 文件的七处目标文本逐项一致。源文件与仓库镜像的剩余差异恰为开工前已存在的 `3` 个未知 hunks（约第 70、241、305 行）；其数量和文本均保持不变。
- `git diff --check` 通过；A 组未执行 `git add`、commit 或 push，也未触碰其他文件。

## B 组：AGENTS.md 专属对象 6—10

### 6. Codex 能力追索规则

#### 理解摘要

- **意图**：当规则引用未安装的 skill／agent 时，先在 Codex 能力域内寻找同名或等价能力，禁止未经授权跨引擎取用配置。
- **约束对象**：发现能力缺口并决定路由的 Session／subagent。
- **与其他章节关系**：承接 Skill 使用规则和角色模板说明，并与外部引擎桥接边界共同限定能力来源。
- **完成判据**：找到等价能力并核实工具名、职责边界和输出契约，或明确报告缺口且不引入外部依赖。

#### 引用与机制有效性

- 规则见 `~/.codex/AGENTS.md:170-176`。
- `/Users/taoyawei/.codex/skills/`、`/Users/taoyawei/.codex/agents/` 均存在；当前 Codex 插件能力可用。
- 本节未引用 S3c 已归档的 skill 或失效机制。

#### 已改清单

- 无。能力追索边界属于本轮禁止直接修改的关键逻辑。

#### 沿用决定

- “内域追索 → 验证等价性 → 报告缺口并禁止越域”的三步顺序短且可执行，沿用原文。

#### 关键逻辑升审建议

- 本节要求规则引用未安装 agent 时先做能力追索；`subagent 派发规则` 第 3 项却要求角色文件不存在时立即询问用户。建议协调者裁决分流条件：规则引用未安装 agent 时先追索；用户点名特定角色且文件不存在时直接报告。该建议涉及能力追索边界，本轮不改。

### 7. 角色模板说明

#### 理解摘要

- **意图**：说明 `agents/` 中的角色文件是 prompt 模板，不会自动注册为 Codex 内置 agent。
- **约束对象**：选择角色并发起派单的 Session。
- **与其他章节关系**：本节说明运行事实；`subagent 派发规则` 规定读取模板和构造派单的操作步骤，两者不构成实质重复。
- **完成判据**：Session 知道按任务选读模板，并在需要派发时使用真实的原生机制创建 subagent。

#### 引用与机制有效性

- 说明见 `~/.codex/AGENTS.md:180-184`。
- `/Users/taoyawei/.codex/agents/` 现场有 `14` 个角色 Markdown 正文及对应 `14` 个 TOML wrapper；`spawn_agent` 是当前有效的 Codex 原生机制。

#### 已改清单

1. **已改**（修改后见 `~/.codex/AGENTS.md:184`，仓库镜像目标文本一致）
   - 原文：`这些文件是角色 prompt 模板，不会自动注册成 Codex 内置 agent。Session 负责决定何时读取哪个角色文件，并用 Codex subagent 工具派发任务。`
   - 新文：`这些文件是角色 prompt 模板，不会自动注册成 Codex 内置 agent。Session 按任务决定读取哪个模板；需要派发时，用 \`spawn_agent\` 创建 subagent。`
   - 明确更好理由：写明真实机制名及“需要派发时”的触发条件，既不把模板误写成注册实体，也不削弱 Session 可亲自执行的例外；表达更短、更可执行。

#### 沿用决定

- 角色目录路径真实、用途明确，沿用。
- 不删除派发规则中的“先读角色文件”：模板说明回答“它是什么”，派发规则回答“派单前做什么”。

#### 关键逻辑升审建议

- 无。

### 8. Session 调度者原则

#### 理解摘要

- **意图**：确立 Session 的目标理解、任务拆分、角色选择、依赖协调、授权约束和最终验收责任。
- **约束对象**：作为调度者的 Session，以及继承同一任务边界的 subagent。
- **与其他章节关系**：连续判断链规定何时不拆；派发规则规定怎么派；后台通知协议规定怎么跟踪；本节负责统一收口和最终责任。
- **完成判据**：任务被适当拆分、派发或由 Session 亲自执行，依赖回收到 Session，结果经 Session 审查、整合和验证后交付。

#### 引用与机制有效性

- 原则见 `~/.codex/AGENTS.md:186-198`。
- 角色平权、禁止二次派单与当前 14 个角色文件的 Codex 协作边界一致；未引用失效路径或机制。
- 进度跟踪和依赖处理由 `~/.codex/AGENTS.md:235-242` 的异步派单、实质消息与现场三态协议落地，整体闭环。

#### 已改清单

- 无。本节含授权边界和 Session 最终验收责任，属于本轮禁止直接修改的关键逻辑。

#### 沿用决定

- 五项职责顺序完整；“不扩大授权”和“最终责任不下放”分别给出边界与完成条件，沿用原文。

#### 关键逻辑升审建议

- `AGENTS.md:198` 的“全局授权”目前由 `:195` 限定为不扩大用户对任务范围和外部写入的授权，逻辑可以成立；为避免被误读为扩大任务授权，建议协调者裁决是否显式限定为“在用户已授权的任务范围内”。该建议涉及授权语义，本轮不改。

### 9. subagent 派发规则

#### 理解摘要

- **意图**：规定派发前读取角色、派单最小上下文、职责匹配、并行写入边界和 Session 复核。
- **约束对象**：创建并协调 subagent 的 Session。
- **与其他章节关系**：把角色模板说明转成派单动作；与后台通知协议衔接主动汇报；最终回到 Session 调度者原则完成验收。
- **完成判据**：角色适配、prompt 字段完整、并行写域互不冲突，且结果由 Session 审查、整合和验证。

#### 引用与机制有效性

- 规则见 `~/.codex/AGENTS.md:200-220`。
- 示例 `/Users/taoyawei/.codex/agents/product-manager.md` 存在；`send_message` 是当前有效的 Codex 原生协作机制。
- 修改前的 prompt 必填项没有接入 `~/.codex/AGENTS.md:241` 已强制规定的完成、遇阻和里程碑主动汇报义务。

#### 已改清单

1. **已改**（新增项见 `~/.codex/AGENTS.md:216`，仓库镜像目标文本一致）
   - 原文：派发 prompt 必填项仅包含项目／角色／规则／文档路径、任务目标、修改范围和多人协作告知。
   - 新文：在该列表中新增 `汇报义务：完成、遇阻以及长任务里程碑均主动用 \`send_message\` 向 Session 报告；细则见“后台 agent 通知处理协议”`。
   - 明确更好理由：不增加新教义，只把后文已有的强制推送协议接入派单入口；引用权威协议而不复制正文，补齐“派出 → 主动汇报 → Session 验收”的执行闭环。

#### 沿用决定

- 角色匹配、并行写域和“不得回滚他人改动”均有明确触发与动作，沿用。

#### 关键逻辑升审建议

1. 第 3 项“角色文件不存在即询问用户”与能力追索规则的优先级需要协调者裁决，见对象 6；本轮不改。
2. 第 9 项“subagent 返回后”可能被误读为裸 idle／轮次结束，与后台通知协议的“实质消息是唯一真信号”存在歧义。建议协调者裁决是否改为“收到实质报告或据现场确认完成后”；因同句承载 Session 最终验收责任，本轮不改。

### 10. 外部引擎桥接边界

#### 理解摘要

- **意图**：把 Codex 原生 subagent 固定为默认执行体，仅在当前任务中用户明确点名 Claude 时允许桥接，并隔离 Claude 的规则、skill、agent、配置和缓存。
- **约束对象**：决定是否调用外部引擎的 Session。
- **与其他章节关系**：与能力追索规则共同禁止默认越域；与 Session 调度者原则共同要求桥接结果仍由 Session 审查、整合和验证。
- **完成判据**：未点名时不调用、建议或依赖桥接；点名后仍遵守配置隔离，并由 Session 复核返回结果。

#### 引用与机制有效性

- 边界见 `~/.codex/AGENTS.md:259-263`。
- `/Users/taoyawei/.codex/skills/claude-delegate/SKILL.md`、其 companion runtime 入口及本机 `claude` 命令均存在；桥接能力真实可用。

#### 已改清单

- 无。默认原生执行体、点名触发和桥接隔离均属于本轮禁止直接修改的关键逻辑。

#### 沿用决定

- 默认、触发条件、禁止项和结果收口责任齐全，沿用原文。

#### 关键逻辑升审建议

- 全局 `AGENTS.md:263` 要求“用户在当前任务中明确点名 Claude”；`~/.codex/agents/scrum-master.md:101-106` 却写“有条件时”即可经 `claude-delegate` 做可选预审，未声明用户点名条件。S3c 已确认该预审条款为生效教义（`reports/s3c-skills.md:18-22`），两处触发语义冲突。建议协调者裁决：A. 保持现有桥接边界，在 SM 条款补充用户当前任务点名条件；或 B. 明确扩大全局例外，允许经裁决的角色流程主动桥接。本轮不得自行选择或修改。

## B 组施工校验

- S4 备份 `/Users/taoyawei/.codex/AGENTS.md.bak-s4-20260716` 已由 A 组在修改前创建；B 组核查时为 `346` 行，SHA-256 `0ebe0afe0ddffa8bf6380292b18da8ae4e8cef2a9e0a67bbdee7a852fd2fbb9f`，未覆盖或改写。
- 当前源文件为 `347` 行，SHA-256 `bc2e708505032ec46976793210f57d139f90c8bf906fa9db35b7018c934cd0f6`。相对 S4 备份的 `diff` 仅包含 A 组已报告的 `7` 行一对一替换，以及 B 组本报告列出的 `1` 处一对一替换和 `1` 行新增；无其他变化。
- 两项 B 组目标文本在源和仓库镜像中均各出现 `1` 次，位置一致为 `:184` 与 `:216`；对象 6、8、10以及对象 9第 3／9 项未改。
- 源与仓库镜像的剩余差异仍只有开工前的 `3` 个未知 hunks：动手前调查的 `spawn_agent` 显式化、首次无实质报告现场核查、核心 TDD 段落压缩；文本与 B 组开工前记录一致，B 组未触碰。
- `git diff --check` 通过；暂存区为空。B 组未执行 `git add`、commit 或 push，也未触碰写入范围外的文件。

## C 组：Codex 专属 skill

### 11. `claude-delegate`

#### 理解摘要

- **意图**：让 Codex 通过本地 companion 调用 Claude Code，支持一次性调用、可恢复的命名 worker 和后台 job。
- **触发条件**：用户要求调用 Claude、征求 Claude 第二视角或管理 Claude worker/session；未点名 Claude 时仍受“外部引擎桥接边界”约束。
- **约束对象**：决定是否桥接及如何复核结果的 Session、执行调用的 companion runtime，以及持久化 worker/job 状态。
- **执行流程**：`doctor` 检查环境；按需 `init`；用 `send` 或 `run` 执行前台／后台任务；后台任务再经 `status`、`result` 或 `cancel` 收口。
- **完成判据**：当前正文只列命令而未集中定义。按实现，前台须成功返回结果；后台返回 job id 只代表已派发，须达到 `completed`、取回 `result`，再由 Session 审查和验证。`failed`／`cancelled` 不算完成。
- **与其他章节关系**：本 skill 是 AGENTS 能力追索后的显式外部桥；不替代默认 Codex 原生 subagent，不扩大授权，返回结果仍由 Session 最终验收。

#### 引用与机制有效性

- `~/.codex/skills/claude-delegate/scripts/claude-companion.mjs`、`agents/openai.yaml` 及状态目录均存在；未读取状态内容。
- `doctor` 只读实跑通过且未发送 Claude 请求：默认 backend 为 SDK、默认 permission mode 为 `bypassPermissions`；Claude Code、Node 与 SDK 依赖均可用。
- 正文列出的命令和参数均有 companion 实现；CLI 当前也支持所列 permission mode。
- `AgentMesh`、`Claude Channels` 及文首类比的 Codex plugin `codex-companion.mjs` 在当前 Codex skills、非缓存 plugins 与 PATH 中均无可追索入口，不能作为现行操作路径。
- 修改前源与仓库镜像 byte exact。

#### 已改清单

1. **已改**（修改后 `SKILL.md:10-15`）：删除不存在的 Codex plugin 类比；明确 SDK 是默认 backend，CLI 只能由调用者通过 `--backend cli` 选择，SDK 失败不会自动切换。该表达与 runtime 的实际 backend 选择一致。
2. **已改**（修改后 `SKILL.md:50-57`）：把恢复语义改为同时覆盖 SDK `resume` 与 CLI `--resume` 两条真实路径，避免把 CLI worker 误写成经 SDK 恢复。
3. **已改**（修改后 `SKILL.md:58-60`）：删除不可执行的 AgentMesh／Claude Channels 路由，明确 suspended worker 能保留上下文但不提供 always-on listener；需要后者时报告能力缺口。
4. **已改**（新增 `SKILL.md:62-67`）：补充最短完成语义：前台成功返回才完成；后台 job id 不算完成，须 `completed` + `result` + Session review/verify；`failed`／`cancelled` 不算完成。

以上只修正可执行性和完成判断，不修改 permission、授权或桥接触发条款。

#### 施工校验

- 修改前备份：`~/.codex/skills/claude-delegate/SKILL.md.bak-s4-20260716`，`147` 行，SHA-256 `e7cbf0c41c442547cf17552d877e1d3226c595ec49dcfdcd91a172f19a21cd92`；创建前确认不存在，创建后与当时源文件 byte exact。
- 修改后：`154` 行，SHA-256 `2cd82e461eb9dd5cb633f16f8c61e290f66328523ebbbd396119d6784ade1522`；源与仓库镜像 byte exact。
- 相对备份的 diff 仅含上述 4 类变化；`AgentMesh`、`Claude Channels` 和 Codex plugin `codex-companion.mjs` 类比残留均为 `0`。
- `Permission Default` 段落前后 SHA-256 均为 `f40437f49bb753217d820f4fe61c9c64357f7ced1f6d711be8458d2247b87de6`；`Operating Rules` 段落前后 SHA-256 均为 `91c24d9bd3edca93975cad358a08a1a8c6eed4dceab38c341af1bd5b5fbe2a58`，关键逻辑原文未动。

#### 沿用决定

- 沿用 frontmatter 的用户显式触发语义、核心命令、Review／Seminar 多轮讨论协议、参数列表、同 worker 禁止并发，以及 Claude 输出必须复核的规则。
- 默认 bypass 的技术事实准确；其政策优先级属于关键逻辑，不在本轮直接修改。

#### 关键逻辑升审建议

1. **默认 bypass 与破坏性规则的优先级**：正文要求所有调用默认绕过 Claude 审批，且除非用户要求更安全否则不加审批层；这可能被误读为覆盖 AGENTS 的授权边界和项目破坏性确认。建议协调者明确：permission mode 只控制 Claude 内部审批，不授予任务范围；全局／项目／用户授权与破坏性规则始终优先。本轮不改。
2. **逐任务点名 gate**：frontmatter 基本符合“用户要求 Claude 才触发”，但 Operating Rules 未显式重申“当前任务点名 Claude”。是否补成本地 gate 涉及桥接边界，本轮不改。
3. **SM 预审冲突**：`scrum-master` 的“有条件时”Claude 预审与 AGENTS 的“当前任务点名才桥接”存在表面冲突。需协调者裁决它是已授权窄例外，还是仍须逐任务点名；本轮不改。
4. **状态敏感数据**：后台 job 会持久化任务和返回内容；是否增加敏感数据提示或收紧实现权限需另行裁决。本轮不读状态内容、不改脚本。

### 12. `codex-usage`

#### 理解摘要

- **意图**：查询 ChatGPT／Codex 订阅计划的聚合使用窗口、plan 和 reset，不查询 OpenAI API 账单。
- **触发条件**：用户询问 Codex 剩余额度、5 小时／每周窗口、reset、rate limit，或 API dashboard 与订阅用量的区别。
- **约束对象**：执行查询和汇报结果的 Session，以及读取本地 OAuth 凭证的第三方 `codex-cli-usage`；凭证内容不得输出。
- **执行流程**：运行固定 venv 中的命令；命令缺失时按固定版本重建；网络失败时按正文尝试网络权限路径；最后用简短格式报告窗口和 reset。
- **完成判据**：当前正文只有成功示例。应以命令零退出且返回订阅用量摘要为成功；认证、网络或字段失败时报告失败与缺失字段，不猜测，也不用 API dashboard 数值代替。
- **与其他章节关系**：这是 Codex 能力域内的用量查询，不触发外部引擎桥接；但自动安装第三方包与网络权限升级仍受工作授权边界约束。

#### 引用与机制有效性

- `~/.codex/runtime/codex-usage-venv/bin/codex-cli-usage` 存在且可执行；help 证实无子命令时默认 `status`，并提供 `status`、`json`、`daemon`、`statusline`、`install`。
- 本地安装包版本为 `0.1.7`，元数据要求 Python `>=3.12`；固定 Python 路径存在且当前为 `3.12.12`。
- `~/.codex/auth.json` 仅确认路径存在，未读取内容；本报告未记录任何凭证值。
- 本地证据能证明 `0.1.7` 被 pin 且已安装，不能证明原文“verified”的验证主体或记录。
- 修改前源与仓库镜像 byte exact。

#### 已改清单

1. **已改**（修改后 `SKILL.md:27-28`）：明确工具只报告 aggregate plan windows，不能把用量归因到单个当前对话；避免把聚合窗口误当单会话因果证据。
2. **已改**（修改后 `SKILL.md:48`）：把无法由本地证据支持的 `verified package version` 改为准确的 `pinned package version`；版本 pin 可由现行命令和本地包元数据验证。
3. **已改**（新增 `SKILL.md:62-67`）：增加最短成功／错误完成语义：零退出并取得订阅摘要才成功；认证、网络或字段失败时报告而不猜测、不用 API dashboard 代替。原有 used／left 含义不明时保留工具原词的规则继续位于 `:79`。

显式增加 `status` 子命令收益不足，沿用当前真实有效的默认命令，不为改而改。

#### 施工校验

- 修改前备份：`~/.codex/skills/codex-usage/SKILL.md.bak-s4-20260716`，`70` 行，SHA-256 `8dc8819963af15852b05ee87a6875c0f9b5d274fe11f8da92dc7766f852c61fb`；创建前确认不存在，创建后与当时源文件 byte exact。
- 修改后：`79` 行，SHA-256 `4b567b559754bb9599013d02d86576870a0305142bbf975b6d26a9ca4b4cb80e`；源与仓库镜像 byte exact。
- 相对备份的 diff 仅含上述 3 类变化；原默认命令及 `status` 默认语义未改。
- `Preferred Command`（含凭证不泄露规则）前后 SHA-256 均为 `e6962bfc0e57d12d8e2f15ede8bd8ab16c6a20a81c712b515c356a1a7879c669`；`Network Notes` 前后 SHA-256 均为 `eaf8c2eb9637048972b70cbe10daea05a2a51adcd3b1e3b9cc990e78540962c7`。安装段仅将 `verified` 改为 `pinned`，命令和自动安装行为未动；关键授权建议仍未实施。

#### 沿用决定

- 沿用 subscription 与 API billing 的边界、5h／7d／plan／reset 字段、固定可执行文件和 auth 路径、不泄露凭证的警告、版本 pin、Python 版本要求、简短响应格式及 used／left 歧义处理。

#### 关键逻辑升审建议

1. **第三方安装授权**：用户只问用量时，命令缺失就自动创建 venv 并安装第三方包，涉及持久写入和供应链动作。需协调者裁决它是否属于预授权修复步骤；本轮不改。
2. **网络权限升级**：`rerun it with escalated network permission` 没有声明授权来源，且并非所有 runtime 都提供该机制。建议协调者限定为仅在当前 runtime 存在且已授权的网络路径时重试，否则报告阻塞；本轮不改。

## C 组统一校验

- 两份 `.bak-s4-20260716` 均在改动前创建且未覆盖；行数和 SHA-256 见各 skill 的施工校验。备份与修改前源 byte exact。
- 两份修改后源文件分别与仓库镜像 byte exact；仓库未纳入备份。
- `claude-delegate` 相对备份仅有 4 类批准改动；`codex-usage` 相对备份仅有 3 类批准改动。关键授权、审批、桥接 gate、自动安装及网络升级原文除获批的 `verified` → `pinned` 准确性修订外均未动。
- `AgentMesh`、`Claude Channels`、不存在的 Codex plugin 类比及 `verified package version` 残留均为 `0`。
- 报告敏感值模式扫描为 `0`；落盘阶段未读取 `auth.json`、`node_modules`、状态内容、脚本或 `.system`，未发起 Claude 请求。
- `git diff --check` 与报告未跟踪文件的 whitespace check 均通过；暂存区路径为 `0`。本执行单元未执行 `git add`、commit 或 push，且未触碰其他 worker 的既有变更。

## 裁决执行记录

- 执行日期：2026-07-16（America/Los_Angeles）。
- 改前备份已创建并以 `cmp` 验证：`~/.codex/AGENTS.md.bak-s4fix-20260716`、`~/.codex/agents/scrum-master.{md,toml}.bak-s4fix-20260716`、`~/.codex/skills/claude-delegate/SKILL.md.bak-s4fix-20260716`、`~/.codex/skills/codex-usage/SKILL.md.bak-s4fix-20260716`。
- 开工前仓库对账抽查 `codex/AGENTS.md`、`codex/agents/code-reviewer.toml`、`codex/skills/dispatch-briefing/SKILL.md`，三者均与 `~/.codex` 对端不一致；因此按裁决未创建 `S4-sync` 提交。以下 S4-fix 只提交本节 12 条裁决，不夹带现场既有的 36 文件差异。

1. **直接请求／命令语义是执行授权必要条件** → `~/.codex/AGENTS.md` 与 `codex/AGENTS.md`「工作授权与沟通纪律 / 明确执行请求」；明确假设句、引用句、背景叙述不构成授权。
2. **偏好／背景信息／反馈按非执行信息处理** → `~/.codex/AGENTS.md` 与 `codex/AGENTS.md`「工作授权与沟通纪律 / 非执行信息」。
3. **能力追索分流** → `~/.codex/AGENTS.md` 与 `codex/AGENTS.md`「Codex 能力追索规则」及「subagent 派发规则」第 3 项；规则引用的缺失能力先追索，用户点名的特定角色文件缺失则直接报告。
4. **调度授权不扩大任务授权** → `~/.codex/AGENTS.md` 与 `codex/AGENTS.md`「Session 调度者原则」收口句；显式限定为“在用户已授权的任务范围内”。
5. **subagent 完成信号消歧** → `~/.codex/AGENTS.md`「subagent 派发规则」第 9 项及 `codex/AGENTS.md` 同节收口句；改为收到实质报告或据现场确认完成后再验收。
6. **Scrum Master 开工前 Claude 预审是经裁决窄例外** → `~/.codex/AGENTS.md` 与 `codex/AGENTS.md`「外部引擎桥接边界」；`~/.codex/agents/scrum-master.md`、`.toml` 与 `codex/agents/scrum-master.md`、`.toml`「Claude 预审（可选，开工前）」。
7. **permission mode 不授予任务范围** → `~/.codex/skills/claude-delegate/SKILL.md` 与 `codex/skills/claude-delegate/SKILL.md`「Permission Default」；全局、项目授权和破坏性确认始终优先。
8. **Operating Rules 引用全局桥接边界及 SM 例外** → 两份 `claude-delegate/SKILL.md`「Operating Rules」第 8 项。
9. **后台 job 持久化敏感信息提醒** → 两份 `claude-delegate/SKILL.md` 状态目录说明；明确后台任务持久化 prompt 与返回内容，敏感数据不得进入 prompt。
10. **缺失 venv／依赖不自动安装第三方包** → `~/.codex/skills/codex-usage/SKILL.md` 与 `codex/skills/codex-usage/SKILL.md`「If The Command Is Missing」；先报告并取得用户确认。
11. **网络重试限于 runtime 已存在且已授权路径** → 两份 `codex-usage/SKILL.md`「Network Notes」；否则报告阻塞。
12. **同步仓库镜像** → 上述 `codex/` 对应文件均落入 S4-fix 提交；提交内容以 `~/.codex` 改后权威版本构造，工作区中 A 阶段发现的既有差异继续保持未提交，不归入本次裁决。
