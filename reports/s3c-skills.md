# S3c Skills 裁决与施工报告

## 范围与裁决

S3c 先纠正 S3b 对 Scrum Master 可选预审能力的裁决，恢复经 `claude-delegate` skill 进行 Claude 第二视角预审的语义；随后以 Claude 现行版为权威备份并移植 22 个同名 skill、完成必要的最小载体适配，归档 12 个僵尸 skill 与 5 个 `.DS_Store`，清理 AGENTS 的失效 skill 索引，并同步仓库镜像。

## 执行原则

- 修改范围限于 Scrum Master 源 Markdown/TOML、22 个同名 skill、全局 AGENTS 的重要 skill 索引、对应仓库镜像和本报告；被替换 skill 的旧目录、僵尸 skill、`.DS_Store` 与 Scrum Master/AGENTS 备份均保留在 `~/.codex/removed-20260716/` 或原配置目录，全部不进入仓库。
- 以当前 S3b 结果为基线做最小增量，不回退或重写其余正文；Markdown 正文与 TOML `developer_instructions` 保持逐字一致。
- Claude 预审仅为有条件时的可选开工前第二视角，不自动触发；审查意见只供修订参考，决定权始终在 SM/用户。

## Scrum Master 裁决纠正

- 源文件：`/Users/taoyawei/.codex/agents/scrum-master.md`、`/Users/taoyawei/.codex/agents/scrum-master.toml`。
- S3c 备份：`/Users/taoyawei/.codex/agents/scrum-master.md.bak-s3c-20260716`、`/Users/taoyawei/.codex/agents/scrum-master.toml.bak-s3c-20260716`；创建前确认均不存在，复制后分别通过 `cmp`，未覆盖既有 `.bak-s3-20260716` 备份。
- 行数：Markdown `291 → 298`；TOML `290 → 297`。
- 插入位置：在“验收标准写完 → PM 轻量复核（强制）”之后、“触发后分两阶段（API → 浏览器）”之前，恢复“Claude 预审（可选，开工前）”小节。
- 教义：有条件时经 `claude-delegate` skill 派 Claude 对 Sprint 文档与验收标准做第二视角审查；仅接受 Opus 4.8 / Fable 5 级高能力模型；意见仅供 SM 修订参考，决定权在 SM/用户；不增加自动触发或 Claude 拍板权。
- TOML：`name` / `description` 保持不变；TOML 解析通过，字段集合与 frontmatter 对齐，`developer_instructions` 与 Markdown 去除 frontmatter 及分隔空行后的正文逐字一致。
- 镜像：源 Markdown/TOML 已同步至 `codex/agents/scrum-master.md` 与 `codex/agents/scrum-master.toml`，2/2 文件通过 byte compare；S3c 备份未进入镜像。
- Grep：`Claude 预审`、`claude-delegate`、`Opus 4.8`、`Fable 5` 均存在；`/Users/taoyawei/.codex/skills/claude-delegate/SKILL.md` 存在；旧“Codex 预审”和 `codex-delegate` 在源文件及镜像中均为 0 处。
- 最小差异：源文件相对 S3c 备份仅新增上述 7 行小节，TOML wrapper 仅同步同一正文增量，其余 S3b 正文不变。

## Skills 施工

后续 skill 施工结果按实际完成项追加于本节。

## .DS_Store 归档

本项先于 skill 目录替换执行，避免 `.DS_Store` 随目录替换一并进入 skill 备份。5 个文件均在确认源存在、目标不存在后以原相对路径移动；未删除、未覆盖。

- `/Users/taoyawei/.codex/skills/.DS_Store` → `/Users/taoyawei/.codex/removed-20260716/ds-store/.DS_Store`；`12292` bytes；SHA-256 `eb29bc6c7974532f2e0a84785960bf4b9ad244e9620c5f31acde5cee3b925ec7`；PASS。
- `/Users/taoyawei/.codex/skills/claude-api/.DS_Store` → `/Users/taoyawei/.codex/removed-20260716/ds-store/claude-api/.DS_Store`；`8196` bytes；SHA-256 `c9b3a8d46e00b0b9781be320ce5bda0ba4e9dc2023d3478a68d30299df2b265b`；PASS。
- `/Users/taoyawei/.codex/skills/knowledge-decompose/.DS_Store` → `/Users/taoyawei/.codex/removed-20260716/ds-store/knowledge-decompose/.DS_Store`；`6148` bytes；SHA-256 `2def9663ee9e467585922e6523a4544a67b8574bb1bf3afd85f83fa2092e7859`；PASS。
- `/Users/taoyawei/.codex/skills/mcp-builder/.DS_Store` → `/Users/taoyawei/.codex/removed-20260716/ds-store/mcp-builder/.DS_Store`；`6148` bytes；SHA-256 `28aa541f4a9eebc9ce65dd82ee8e651abe41c6c0389759e937bb7efa2452c2fe`；PASS。
- `/Users/taoyawei/.codex/skills/webapp-testing/.DS_Store` → `/Users/taoyawei/.codex/removed-20260716/ds-store/webapp-testing/.DS_Store`；`6148` bytes；SHA-256 `b942bfc715c38905df45857519e4888bcd0d0cb844d2fae13f0193da54bccebb`；PASS。

归档后 5 个源路径均不存在，5 个归档目标均存在且字节数与 SHA-256 和移动前一致；全量扫描 `/Users/taoyawei/.codex/skills` 的 `.DS_Store` 结果为 `0`。

### acceptance-testing

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/acceptance-testing`；`1` 文件、`24628` bytes；树 SHA-256 `2f24843004870eb7897556dc29c70bea88c9c9757094231aed3ecde45084a881`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`30561` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`2` 处，均为 `SKILL.md` 中全局 `~/.claude/CLAUDE.md` / `CLAUDE.md` 契约路径引用；无 Claude 专属工具、固定模型或其他载体命中。
- 载体适配：仅修改 `SKILL.md` 的 2 处权威入口为 `~/.codex/AGENTS.md` / `AGENTS.md`；验收矩阵、状态机及其教义未改。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/acceptance-testing` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `0bbb89524b3ed9c46eb1c67b3bb3493875e8e73ecb1fa5117f6938a66641e31a`，备份未入仓库。

### browser-e2e-testing

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/browser-e2e-testing`；`1` 文件、`9342` bytes；树 SHA-256 `ed508b5d9fa84e12b9245195ef0da26d8bfc7e86088937c06d0383afa888ed7f`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`10204` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；数据清理的环境分支及其教义保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/browser-e2e-testing` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `81b5c7b6b92d7d4a259b5392e276107c4e1ac5a3b6366c7052d8af370d2cce23`，备份未入仓库。

### claude-api

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/claude-api`；`71` 文件、`855778` bytes；树 SHA-256 `3ce491ca381722b2a55c1add70a9eb7a8c4c803d95591d83cb7dc26b1ce39310`，与移动前一致。
- Claude 整目录 rsync：`66` 文件、`793427` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：大小写不敏感合并口径共 `613` 行、`54` 文件。载体类为 `WebFetch` `52` 行、`AskUserQuestion` `2` 行、`CLAUDE.md` 示例 `4` 行；允许领域类包括 Claude Opus/Sonnet/Haiku 模型文档 `549` 行、Managed Agents API 的 `sendMessage` `5` 行与 Agent tool/toolset `8` 行、Anthropic CLI `explore` 格式 `1` 行（分类有行级交叠）。
- 载体适配：`24` 文件的 `52` 个 `WebFetch` 点改为 Codex web，`SKILL.md` 的 `2` 个提问工具点改为 `request_user_input`，`shared/token-counting.md` 的 `4` 个工作文件示例改为 `AGENTS.md`；Claude 品牌、API、模型 ID、Managed Agents 语义未改。
- 最终残留：Claude 路径、`CLAUDE.md`、Claude 专属调度/提问/后台/Web 工具等不允许载体均为 `0`；上述模型、API 方法/toolset 与 CLI 格式作为领域正文保留；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/claude-api` 受控文件 `66` 个，与新目标 byte exact；双方树 SHA-256 均为 `f788ac2381dfc6882479386006998f83f340653da77195ef87bafc21fcf52938`，备份未入仓库。

### dispatch-briefing

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/dispatch-briefing`；`1` 文件、`3930` bytes；树 SHA-256 `6d71c966dd277f79175b40acd8c2a04fca57d388e6811aa46888255812ca5cdf`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`4157` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`2` 处，分别为项目 `CLAUDE.md` 契约路径和 `~/.claude/skills/test-driven-development/SKILL.md` skill 路径；无 Claude 专属工具或固定模型命中。
- 载体适配：`SKILL.md` 的 2 个路径分别改为项目 `AGENTS.md` 与 `~/.codex/skills/test-driven-development/SKILL.md`；六段式简报教义未改，改出 skill 路径已验证存在。
- 最终残留：同口径 grep `0`。
- 仓库同步：`codex/skills/dispatch-briefing` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `a6d589d1ba09836aebe23931b3a64893013e94dab42fc6b6b6157476c956af7e`，备份未入仓库。

### fact-checking

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/fact-checking`；`1` 文件、`7102` bytes；树 SHA-256 `063e48e8ce6f1cb8c3b0a783939b85ef5f589188779d49dbfd228df955404e65`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`13404` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；合并后的 source-verification 流程与事实核查教义保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/fact-checking` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `bbdfe6836c2597b6ca59095e8cbf7d1c542a648490f198ef51c26327ba8b7802`，备份未入仓库。

### frontend-design

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/frontend-design`；`2` 文件、`18434` bytes；树 SHA-256 `1c85d2efae03f05ebef44501999cefe6d294a8ad310705506fdfe08f19c36a47`，与移动前一致。
- Claude 整目录 rsync：`2` 文件、`18434` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`1` 处，为流程标题中的普通动词 `explore`，不属于 Claude Explore 工具；无 Claude 路径、专属工具或固定模型命中。
- 载体适配：无；前端设计流程与视觉教义保持 Claude 源原样。
- 最终残留：不允许载体 `0`；普通动词 `explore` `1` 处分类保留；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/frontend-design` 受控文件 `2` 个，与新目标 byte exact；双方树 SHA-256 均为 `1c85d2efae03f05ebef44501999cefe6d294a8ad310705506fdfe08f19c36a47`，备份未入仓库。

### knowledge-decompose

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/knowledge-decompose`；`1` 文件、`38240` bytes；树 SHA-256 `12e1753bc5bed10e72f964bc6b2b5542e947ae25d54711a11e3ea9780bfd5de2`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`43290` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：规定口径 `6` 处（Web 搜索 `2`、Sonnet/固定 Claude 模型 `4`）；补充 Task 语义扫描命中 `3` 处（Task 调用、Task 工具、伪代码类型）。
- 载体适配：联网调研改为 Codex web；术语验证改为 Codex subagent + 运行时默认模型 + Codex web；Task 调度改为 `spawn_agent`，伪代码任务类型改为 `AgentTask`。预算闸、并行上限、节点计数及知识拆解教义未改。
- 最终残留：规定口径 grep `0`，补充 `Task` 词扫描 `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/knowledge-decompose` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `ede2b37ccba5048f4c8efc913109a1cbc9e8343c0ae626eec92b50001814b886`，备份未入仓库。

### layered-diagnosis

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/layered-diagnosis`；`1` 文件、`7551` bytes；树 SHA-256 `96f410e1216d2704b9e628718aecac824ca5aa68937567af32495ec0a0ad2eff`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`7551` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；分层诊断方法论保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/layered-diagnosis` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `96f410e1216d2704b9e628718aecac824ca5aa68937567af32495ec0a0ad2eff`，备份未入仓库。

### mcp-builder

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/mcp-builder`；`12` 文件、`147655` bytes；树 SHA-256 `76f814033dd65ee476914e5416d406edfd5c95527927b87f31ff981ae9519dad`，与移动前一致。
- Claude 整目录 rsync：`10` 文件、`121756` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`4` 处，均为 `SKILL.md` / `reference/python_mcp_server.md` 中 Claude `WebFetch` 执行载体；无 Claude 路径或其他调度工具命中。补充品牌/模型扫描命中 `3` 处，来自内置 Anthropic API 评估脚本及其 CLI 文档。
- 载体适配：仅将 `4` 处 `WebFetch` / web search 表述改为 Codex web search 与 `open`；MCP 构建方法和 URL 未改。内置 `evaluation.py` 明确通过 Anthropic SDK 运行评估，故其 Claude API、模型默认值及对应 CLI 文档作为领域实现保留，不当作 Session 载体替换。
- 最终残留：Claude 路径与 Claude 专属 Session 工具同口径 grep `0`；仅保留上述 Anthropic API 评估实现 `3` 处并已分类说明；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/mcp-builder` 受控文件 `10` 个，与新目标 byte exact；双方 `121785` bytes，树 SHA-256 均为 `a7a5eccc4ba991bfc2537159be0a5f4593d2b73d5ec3ebed6b80eadc63740679`，备份未入仓库。

### news-pitch

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/news-pitch`；`1` 文件、`5145` bytes；树 SHA-256 `004eb60c3526eec48869e300ffe200b91a61e85cba4284b89df106e7355d7ec5`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`5359` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；新闻选题立项方法论保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/news-pitch` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `e15207372f4bab0f1aaf22fb33c62320a71ace3024d5bc9cbb132b3e6dbb6db3`，备份未入仓库。

### news-writing

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/news-writing`；`1` 文件、`6701` bytes；树 SHA-256 `fd4b14ede896726ab9e9ae14622b4b0a2c9c1fa8cdca746fb72b587224372686`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`6757` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；中文新闻文体与反 AI 痕迹方法论保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/news-writing` 受控文件 `1` 个，与新目标 byte exact；双方树 SHA-256 均为 `ae8480300a51e8a929ffa984a349555945cbf40f33a0f0925d03cdb4318fb462`，备份未入仓库。

### post-compact

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/post-compact`；`1` 文件、`591` bytes；树 SHA-256 `bdcb5a229013c6e4a75d7967ac6470dd2ac42a6faa560af4b76b0e2bd01b210c`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`313` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`1` 行，包含全局 `~/.claude/CLAUDE.md` 与项目根 `CLAUDE.md` 两个工作契约路径；无 Claude 专属工具或固定模型命中。
- 载体适配：只将两个恢复入口改为 `~/.codex/AGENTS.md` 与项目根 `AGENTS.md`；上下文压缩后先重读契约再行动的教义未改。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/post-compact` 受控文件 `1` 个，与新目标 byte exact；双方 `312` bytes，树 SHA-256 均为 `4ecaeaed9f280d4444a62d2d631bf5aff099987bd2569bfcbb7ff5fd1611b3e4`，备份未入仓库。

### project-bootstrap

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/project-bootstrap`；`1` 文件、`2832` bytes；树 SHA-256 `b4eb5c014ebd518b2767482c41460e194c22fccba0fc1b68922fc17ed31c84e7`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`2401` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`1` 行，命中参考项目 `CLAUDE.md` 契约；同一行还含 Claude 权限载体“system-architect 无 Write 权限、文本回传由 session 落盘”。无固定模型命中。
- 载体适配：将参考契约改为 `AGENTS.md`；角色协作改为 Codex `system-architect` subagent，由 Session 明确写入范围并验收。项目克隆、资源独立化和静默推进方法论未改；正文引用的 `frontend-design` 已验证存在。
- 最终残留：扩展口径（含 `Write tool`）grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/project-bootstrap` 受控文件 `1` 个，与新目标 byte exact；双方 `2385` bytes，树 SHA-256 均为 `7088704d50954cfc5e9496a54da0d2386e3c67343ef0d3f95f0a1d919fcc93eb`，备份未入仓库。

### quote-verification

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/quote-verification`；`1` 文件、`2193` bytes；树 SHA-256 `813fb02ad9fb19e7cecba014f0e5a0ff97cf56936560b3b26c5dce60282bd7a8`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`2036` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`1` 处，为定位原典步骤使用的 `WebSearch/WebFetch` 执行载体；无 Claude 路径、调度工具或固定模型命中。
- 载体适配：仅将该执行载体改为 Codex web search / `open`；引文真实性核验流程和权威源要求未改。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/quote-verification` 受控文件 `1` 个，与新目标 byte exact；双方 `2047` bytes，树 SHA-256 均为 `155e0df33774635b83ed5d8e3ba4306e45f84c52760c765ba980c760b0898e68`，备份未入仓库。

### recursive-think

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/recursive-think`；`1` 文件、`36192` bytes；树 SHA-256 `37c5b1b6624fd39f8a6f45d6773ed13e88c97ab46fa97c6854b1136540c55120`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`39134` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`4` 处，为 `Task` 调用/工具/伪代码类型、Claude skill 绝对路径；无其他 Claude 路径、固定模型或专属工具命中。
- 载体适配：`Task` 调用/工具改为 `spawn_agent`，伪代码参数类型改为 `AgentTask`，读取路径改为 `~/.codex/skills/recursive-think/SKILL.md`；预算闸、并行上限、节点计数与递归思考教义未改。
- 最终残留：同口径 grep `0`；新路径 `~/.codex/skills/recursive-think/SKILL.md` 已验证存在。
- 仓库同步：`codex/skills/recursive-think` 受控文件 `1` 个，与新目标 byte exact；双方 `39118` bytes，树 SHA-256 均为 `6e7787fd48e1bd03f892d0e3668d590c342422cd966e72fed718905f235c258d`，备份未入仓库。

### source-archiving

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/source-archiving`；`1` 文件、`5708` bytes；树 SHA-256 `9c06099ae1e32519c4aca9e2587bbfb23511ef0b42c2b33e160783506e57910b`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`5960` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；三层存档流程（Memento 为其中子步骤）与其余教义保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/source-archiving` 受控文件 `1` 个，与新目标 byte exact；双方 `5960` bytes，树 SHA-256 均为 `9b9d6c79a4b2b4769b71401bb35b54e2c0635fbba1ad6870b1b0fca2d243fa2a`，备份未入仓库。

### tdd-amendment-bug-fix

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/tdd-amendment-bug-fix`；`1` 文件、`2602` bytes；树 SHA-256 `674bfb54d7665be22e35d48b39504296b9155085c9d21d5b46691b66708f2543`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`4489` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`1` 处，为基础 TDD skill 的 `~/.claude/skills/test-driven-development/SKILL.md` 路径；无 Claude 专属工具或固定模型命中。
- 载体适配：仅将基础 TDD skill 路径改为 `~/.codex/skills/test-driven-development/SKILL.md`，且目标已验证存在；黄测=复现探测器、修前双红/修后双绿、完工主动探雷、测试写成后永不改等教义未改。
- 最终残留：同口径 grep `0`；新 skill 路径已验证存在。
- 仓库同步：`codex/skills/tdd-amendment-bug-fix` 受控文件 `1` 个，与新目标 byte exact；双方 `4489` bytes，树 SHA-256 均为 `d3edb6e3b2d22a175dd9fdc8668f598d13f689516253b2cbfd0f9341c6d1df96`，备份未入仓库。

### tech-council-review

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/tech-council-review`；`4` 文件、`45096` bytes；树 SHA-256 `a6df346fb497976ba87a7397b614d5ea1f1bf5b5784ab37d0b417bd65aa52073`，与移动前一致。
- Claude 整目录 rsync：`4` 文件、`45694` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：载体命中 `1` 个双引擎段落（默认 Claude subagent、全局 `CLAUDE.md`、`codex-delegate`、随机混合）；补充命中 `background subagent` `1` 处。另有 `claude-api` 示例与开源方法论仓库归因各 `1` 处，属合理领域内容。
- 载体适配：席位默认改为 Codex 原生 subagent，并行启动改为 `spawn_agent`；只有用户在当前任务明确点名 Claude 时才允许通过 `claude-delegate` 引入指定席位，未点名不自动调用/建议/随机混入。全员平权、统一风险打分与主持人/用户最终决定权未改。
- 最终残留：不允许载体 grep `0`；保留 `claude-api` skill 举例、用户明确点名时的 `claude-delegate` 条件式路由与开源来源归因，均已分类；`claude-delegate` 路径已验证存在。
- 仓库同步：`codex/skills/tech-council-review` 受控文件 `4` 个，与新目标 byte exact；双方 `45477` bytes，树 SHA-256 均为 `8aba6dbe98147aaf294b5a5b77ac983b517f8c4bb872c347adefedf96ebb84b6`，备份未入仓库。

### test-driven-development

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/test-driven-development`；`2` 文件、`18145` bytes；树 SHA-256 `83ff939768fb0c101fbc655e022ce72d308f881ccd4289379955e36c046d1f31`，与移动前一致。
- Claude 整目录 rsync：`2` 文件、`18145` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；TDD 基础方法与教义保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/test-driven-development` 受控文件 `2` 个，与新目标 byte exact；双方 `18145` bytes，树 SHA-256 均为 `83ff939768fb0c101fbc655e022ce72d308f881ccd4289379955e36c046d1f31`，备份未入仓库。

### webapp-testing

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/webapp-testing`；`6` 文件、`22394` bytes；树 SHA-256 `8824b080a1d66ffdc8dc876eb3b677822c0781e813eaa4d8cc93a0292515ec86`，与移动前一致。
- Claude 整目录 rsync：`6` 文件、`22394` bytes（排除 `*.bak*`、`.DS_Store`）；按大目录约束未逐文件通读。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；Web 应用测试工具与方法保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/webapp-testing` 受控文件 `6` 个，与新目标 byte exact；双方 `22394` bytes，树 SHA-256 均为 `8824b080a1d66ffdc8dc876eb3b677822c0781e813eaa4d8cc93a0292515ec86`，备份未入仓库。

### word-drill

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/word-drill`；`1` 文件、`4572` bytes；树 SHA-256 `3184b14d40d45241857071a1b19291c6b40aa380c8387aec55fd94867f2271a6`，与移动前一致。
- Claude 整目录 rsync：`1` 文件、`4572` bytes（排除 `*.bak*`、`.DS_Store`）。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；单词练习方法保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/word-drill` 受控文件 `1` 个，与新目标 byte exact；双方 `4572` bytes，树 SHA-256 均为 `3184b14d40d45241857071a1b19291c6b40aa380c8387aec55fd94867f2271a6`，备份未入仓库。

### xlsx

- 旧目录归档：`/Users/taoyawei/.codex/removed-20260716/skills-replaced-backup/xlsx`；`54` 文件、`1093063` bytes；树 SHA-256 `15f0e4981d4f7cce6f960a3d1789e9c0688cdc01bf85623811bb82831786c37d`，与移动前一致。
- Claude 整目录 rsync：`54` 文件、`1093063` bytes（排除 `*.bak*`、`.DS_Store`）；按大目录约束未逐文件通读。
- 初始 grep：`0`；无 Claude 路径、专属工具、固定模型或其他载体命中。
- 载体适配：无；表格处理方法、脚本与资源保持 Claude 源原样。
- 最终残留：同口径 grep `0`；无新增 `~/.codex/skills/<x>` 引用需要追索。
- 仓库同步：`codex/skills/xlsx` 受控文件 `54` 个，与新目标 byte exact；双方 `1093063` bytes，树 SHA-256 均为 `15f0e4981d4f7cce6f960a3d1789e9c0688cdc01bf85623811bb82831786c37d`，备份未入仓库。

## 僵尸 skill 归档

以下目录均在确认活跃源存在、归档目标不存在后逐项 `mv` 到 `/Users/taoyawei/.codex/removed-20260716/`；未删除、未覆盖。文件数、总字节数及稳定树 SHA-256 均在移动前后逐项复核一致。

- `gstack`：`1125` 文件、`44842373` bytes、树 SHA-256 `07cd7c2b63b186edd6c9c1b00716beaf5da9279d4583fa3a0b54b4bc566ce7b0`；PASS。
- `source-verification`：`1` 文件、`6526` bytes、树 SHA-256 `c64fdfe4357bf2204783dc6e8b45cd54b9b3faef138b661aff9a2cd8d3be6938`；PASS。
- `algorithmic-art`：`4` 文件、`59852` bytes、树 SHA-256 `8f0a068b34f55d50351e9942fb81b54fc93ea100eab19ec5a39894890f90e7c0`；PASS。
- `amesh`：`1` 文件、`2212` bytes、树 SHA-256 `6f01aec50c4c179acfab58471bd1c5a697a30176647b06b5c5cc163e9d52cb7b`；PASS。
- `brand-guidelines`：`2` 文件、`13580` bytes、树 SHA-256 `e5fbdf1358f086f4cf286c05c19f7033bfd9daf147f9ac7b41dbb2fae47dec7a`；PASS。
- `canvas-design`：`83` 文件、`5554032` bytes、树 SHA-256 `43f462f54484636de2224b7aafa1974b1fc941d7c11e33d2b3763d3da1fb8762`；PASS。
- `doc-coauthoring`：`1` 文件、`15992` bytes、树 SHA-256 `ae65edc91fc1f5e594813eb95bfd96b5ec8323456294cc7e80db4a96c604c158`；PASS。
- `find-skills`：`1` 文件、`5519` bytes、树 SHA-256 `c2aedaa2c5fb32a75431a0580fde7f15d5ac14ef95331440a00273b229c6c7c8`；PASS。
- `internal-comms`：`6` 文件、`22392` bytes、树 SHA-256 `347b9c96543f7dee0f796896d674d4480ac0b4fe05484438a6e388626560286e`；PASS。
- `slack-gif-creator`：`7` 文件、`43697` bytes、树 SHA-256 `05f11ad063bd9ebf25bac468e245d3e9ede882676fb82dc8f3392609b271d221`；PASS。
- `theme-factory`：`13` 文件、`144094` bytes、树 SHA-256 `52f5c2f6a0bd382d1c726ae42292b45a5367cf3b4c0291524a39f2985eb01c48`；PASS。
- `web-artifacts-builder`：`5` 文件、`45840` bytes、树 SHA-256 `ed186eb0979787b6cc147b2b46b5895d0640cf62cf53a8e7b2c623ec2b2cf02d`；PASS。

归档闭环复核：上述 `12/12` 活跃源目录均已不存在，`12/12` 归档目标均存在；每个目标的文件数、总字节数与稳定树 SHA-256 均与移动前一致。

## 重要 skill 索引清理

- 修改前仅在 `/Users/taoyawei/.codex/AGENTS.md` 的“重要 skill”表命中 1 个已归档目录：`find-skills`；其余 11 个无引用。
- 先确认目标不存在并创建 `/Users/taoyawei/.codex/AGENTS.md.bak-s3c-20260716`，备份与修改前源文件 byte exact；备份不进入仓库。
- 最小修改仅删除 `find-skills` 索引行；AGENTS 行数 `347 → 346`，其余规则未改；对 12 个归档名称复扫为 `0` 命中。
- 已同步到 `codex/AGENTS.md`，源文件与仓库镜像 byte exact。

## 最终镜像与保护项复核

- 以仓库 README 的配置边界执行 `rsync -a --delete`：`/Users/taoyawei/.codex/skills/` → `codex/skills/`；排除 `*.bak*`、`.DS_Store`、`node_modules/`、`__pycache__/`、`*.pyc` / `*.pyo`、cache/tmp/runtime 及其他运行时、隐私目录。
- 归档结果：12 个僵尸目录在活跃源和仓库镜像中均不存在，在 `/Users/taoyawei/.codex/removed-20260716/` 中均存在；22 个已移植同名 skill 在活跃源和仓库镜像中均存在。
- 最终受控镜像：按同一排除集合执行 checksum dry-run，源与仓库输出为空，即 byte exact；仓库中 `.DS_Store`、备份、`node_modules`、`__pycache__`、cache/tmp/runtime 等禁止项扫描为 `0`。
- 保护项采用预检的稳定 manifest hash（包含目录、空目录和软链接目标，不包含权限位）复核，源在同步前后均保持基线：
  - `.system`：`7e431d6ba152b4359f46d2d99a5ccd41314ca3a2cb882cec0fc3feea8232bb8d`；仓库镜像相同。
  - `claude-delegate` 完整源：`d11826b046d1216d860c21e606c453d9ce3a16ba2f017a268d45bac7448c7321`；排除 `node_modules` 的受控源：`d268cec9c9cbd5c2b0c71e40c0011e6e481181a0703b4f39b66bcc311ba1821a`，仓库受控镜像相同。
  - `codex-usage`：`55426d3b6cf61b777825a979e1c60e443f71735cf4cc9b73e1e57c9dae2a4e63`；仓库镜像相同。
- `/Users/taoyawei/.codex/AGENTS.md` 与 `codex/AGENTS.md` byte exact；`git diff --check` 通过。本执行单元未修改任一 skill 正文，也未执行 git add / commit / push。
