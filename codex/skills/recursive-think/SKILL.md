---
name: recursive-think
description: 通用递归思考框架，将任意主题递归拆解为结构化文档，适用于产品设计、前端UI、行业调研、架构设计等任意领域。当用户说「递归思考」「递归设计」「递归分析」「递归展开」「递归调研」，或把「递归」与设计/分析/调研/拆解等动词搭配时使用；「递归算法」「递归函数」等编程语境不要触发。
---

// ── 伪代码声明 ──
// 本文件是伪代码，不是可执行程序。
// 选择伪代码而非自然语言，是因为自然语言歧义太多——
// 伪代码用结构化的方式消除歧义，表达执行逻辑和流程顺序。
//
// 但伪代码不等于真代码。所有函数、条件、返回值表达的是"思考框架"，
// 不是机械指令。智能体应理解意图，用自身判断力执行，
// 而非逐字翻译为代码逻辑。
//
// 特别是涉及主观判断的地方（如 isLeaf、recheck），
// 伪代码提供的是判断维度和提醒信号，最终决策由智能体自主做出。
//
// ── 核心哲学 ──
// 设计精细度不应由功能多寡决定，而应由 AI 的上下文能力决定。
// 通过递归，让每个节点独享完整的 AI 思考能力。
// 在合理范围内，通过递归让每个细节都被充分展开。

```java
// ============================================================
// 常量与配置
// ============================================================

final String[] FORBIDDEN_DIRS = {"/", "~", "~/Desktop", "~/Downloads", "~/Documents", "/tmp"};
final int MAX_DEPTH = 6;           // 软阈值：超过后倾向叶节点，但确需继续可突破
final int MAX_CORRECTION = 2;      // 同一子节点最多纠错轮数

// ============================================================
// 数据结构
// ============================================================

class Proposition {
    String name;            // 暂定名称
    String scope;           // 预期覆盖范围
    String boundary;        // 与兄弟节点的边界说明
    String context;         // 定位信息：相关代码路径、文档路径等（不传递知识，知识由 ancestorResearchPaths 承载）
    String[] ancestorResearchPaths;  // 祖先调研文件路径链（从根到父，自顶向下有序）
                                     // 子节点调研前先读这些文件，复用已有知识，避免重复调研
    boolean requiresCrossVerification;  // 父节点决定：该子节点是否需要交叉验证
                                        // true → 子节点在调研后执行交叉验证
                                        // false → 跳过交叉验证（方向清晰/不证自明/低重要性）
}

class Node {
    // -- 所有节点 --
    String name;
    String summary;         // 内部节点：核心问题概括；叶节点：充分展开的完整内容
    boolean isLeaf;

    // -- 仅内部节点 --
    Node[] children;        // 至少 2 个，上限由结构决定

    // -- 领域特定属性（由 DomainProfile 决定填充哪些） --
    Map<String, Object> attributes;  // 灵活属性，不同领域不同字段
}

// 纠错报告：子节点发现命题有问题时返回给父节点
class ErrorReport {
    String errorType;       // "范围过大" | "范围过小" | "方向错误" | "边界模糊" | "定义不准确"
    String detail;          // 哪里与调研结果不符
    Proposition suggestion; // 建议的修正命题
}

// 调研结果（递归单元步骤 1 的输出）
// Research 不是强类型类，而是约定接口——以下字段是最低契约，
// 智能体在此基础上根据领域自由扩展。
class Research {
    // -- 最低契约字段（所有领域必须填充） --
    String confirmedName;       // 调研后确认的节点名称（可能修正了命题中的暂定名称）
    String definition;          // 节点的定义描述
    boolean validates(Proposition prop);  // 命题是否与调研结果一致
    String errorType;           // 命题不准确时的错误类型（validates 为 false 时填充）
    String mismatch;            // 具体哪里不符
    Proposition suggestFix;     // 建议的修正命题

    // -- 领域自定义扩展 --
    // 智能体根据领域和调研内容自行组织其他数据

    // -- 交叉验证记录 --
    CrossVerification[] verifications;  // 关键事实的交叉验证记录
}

class CrossVerification {
    String claim;           // 关键事实/论断
    String[] sources;       // 独立信息源列表（URL 或来源描述）
    boolean verified;       // 是否完成交叉验证（≥2 个独立信息源一致）
    String note;            // 不一致或无法验证时的说明
}

// 递归单元的返回值（轻量信号 + meta，完整数据在 WIP 文件中）
class NodeResult {
    boolean success;        // true=正常返回, false=纠错上报
    ErrorReport error;      // !success 时填充

    // success 时填充以下 meta（父节点用于快速汇总，无需读 WIP 文件）
    String name;
    String briefSummary;    // 摘要版（200 字以内），用于父节点快速汇总；完整内容在 WIP 文件中
    boolean isLeaf;
    Map<String, Object> attributes;
}

// ============================================================
// 领域适配 — DomainProfile
// ============================================================
// 通过 DomainProfile 配置适配不同领域，不写死在框架里。
// 框架内置常用 profile，用户也可在触发时自定义。

class DomainProfile {
    String domain;              // 领域标识
    String description;         // 领域描述，帮助智能体理解上下文
    LeafCriteria leafCriteria;  // 领域特定的叶节点判断补充规则
    String outputFormat;        // 叶节点输出格式模板
    String[] researchMethods;   // 调研方式：["web", "code", "docs", "pdf"]
    String[] qualityChecks;     // 领域特定的质量检查规则
    String[] nodeAttributes;    // 节点需要填充的领域特定属性
}

class LeafCriteria {
    String atomicDefinition;    // 什么算"原子单元"的领域解释
    String[] splitSignals;      // 需要拆分的信号词/模式
    String contextBudget;       // 上下文预算说明（一个 subagent 能否完整处理）
}

// ============================================================
// 内置领域 Profile
// ============================================================

DomainProfile PRODUCT_DESIGN = {
    domain: "product-design",
    description: "产品功能设计、用户体验设计、交互设计",
    leafCriteria: {
        atomicDefinition: "一个独立的用户操作或界面元素，可以用一段话完整描述其行为",
        splitSignals: ["多个入口", "不同状态", "多种用户角色", "以及", "同时"],
        contextBudget: "一个 subagent 能在一个上下文窗口内完整描述该功能的所有状态、交互、边界情况"
    },
    outputFormat: "功能描述 → 用户故事 → 交互流程 → 状态说明 → 边界/异常情况 → 验收标准",
    researchMethods: ["web", "docs"],
    qualityChecks: ["用户故事是否完整", "边界情况是否覆盖", "状态转换是否无遗漏"],
    nodeAttributes: ["userStory", "states", "interactions", "edgeCases", "acceptanceCriteria"]
};

DomainProfile FRONTEND_UI = {
    domain: "frontend-ui",
    description: "前端界面设计、组件设计、布局设计",
    leafCriteria: {
        atomicDefinition: "一个独立的 UI 组件或布局区域，可以用一段话完整描述其视觉和交互",
        splitSignals: ["多个变体", "响应式断点", "多种状态", "嵌套组件"],
        contextBudget: "一个 subagent 能在一个上下文窗口内完整描述该组件的所有变体、状态、响应式行为"
    },
    outputFormat: "组件描述 → 视觉规格（尺寸/颜色/字体）→ 状态变体 → 响应式行为 → 交互说明 → 无障碍要求",
    researchMethods: ["web", "code", "docs"],
    qualityChecks: ["视觉规格是否具体可实现", "状态是否完整", "响应式是否覆盖"],
    nodeAttributes: ["visualSpec", "states", "responsive", "interactions", "accessibility"]
};

DomainProfile INDUSTRY_RESEARCH = {
    domain: "industry-research",
    description: "行业调研、市场分析、竞品分析",
    leafCriteria: {
        atomicDefinition: "一个独立的调研子话题，可以用一段话完整定义其范围",
        splitSignals: ["多个维度", "不同市场", "多个竞品", "以及", "另外"],
        contextBudget: "一个 subagent 能在一个上下文窗口内充分调研并输出该子话题的完整分析"
    },
    outputFormat: "现状概述 → 关键数据/事实 → 趋势分析 → 关键玩家 → 机会与风险 → 结论",
    researchMethods: ["web"],
    qualityChecks: ["数据是否有来源", "分析是否有论据支撑", "结论是否可操作"],
    nodeAttributes: ["keyData", "trends", "players", "opportunities", "risks"]
};

DomainProfile ARCHITECTURE = {
    domain: "architecture",
    description: "系统架构设计、技术方案设计",
    leafCriteria: {
        atomicDefinition: "一个独立的架构决策或技术组件，可以用一段话完整描述其职责",
        splitSignals: ["多个子系统", "多种方案", "不同层次", "以及"],
        contextBudget: "一个 subagent 能在一个上下文窗口内完整描述该组件的设计、接口、约束"
    },
    outputFormat: "职责描述 → 设计决策（含备选方案对比）→ 接口定义 → 依赖关系 → 约束与限制 → 扩展点",
    researchMethods: ["web", "code", "docs"],
    qualityChecks: ["职责是否单一", "接口是否清晰", "依赖是否合理"],
    nodeAttributes: ["responsibility", "decisions", "interfaces", "dependencies", "constraints"]
};

// selectProfile() 自定义分支调用此流程
DomainProfile buildCustomProfile(String topic) {
    // 通过以下问题引导用户描述领域特征，动态生成 DomainProfile：
    //   1. "这个领域中，什么算一个不可再分的原子单元？"    → atomicDefinition
    //   2. "叶节点应该输出哪些内容、按什么顺序？"          → outputFormat
    //   3. "调研方式是联网搜索、读代码、读文档、还是混合？"  → researchMethods
    //   4. "质量检查时最关心哪几个方面？"                   → qualityChecks
    //   5. "每个节点需要记录哪些领域特有的属性？"            → nodeAttributes
    // 用户可以跳过任何问题，框架会根据主题智能推断默认值
}

// ============================================================
// 全局规则
// ============================================================

void onCompactDetected() {
    // 上下文被压缩时立即执行，恢复完成前禁止任何操作
    reread("SKILL.md");

    // 扫描当前目录下的 *-wip/ 目录，恢复递归进度
    Dir wipDir = scan("*-wip/");
    if (wipDir != null) {
        rereadDir(wipDir);                              // 读取 WIP 文件恢复节点状态
        reread(wipDir + "/profile.meta");               // 恢复 DomainProfile
    }
}

// ============================================================
// 启动流程
// ============================================================

void main() {
    // 第一步：安全检查
    if (currentDir in FORBIDDEN_DIRS) {
        warn("禁止在此目录操作，请切换到具体项目目录");
        return;
    }

    // 第二步：确认主题和领域
    String topic = extractTopic();          // 从用户输入提取主题
    DomainProfile profile = selectProfile(topic, userHint);
    // 匹配策略（按优先级）：
    // 1. 精确匹配：用户明确指定领域名/别名 → 直接使用对应内置 profile
    // 2. 语义匹配：根据主题推断 top-2 候选 → 向用户确认选择
    // 3. 自定义：低置信度或用户明确要求 → 走 buildCustomProfile() 问答流程
    //    （即下方 DomainProfile 动态生成的 5 个引导问题，用户可跳过，框架智能推断默认值）

    // 第三步：规模检查（成本控制，递归会派大量 subagent）
    if (isTooLarge(topic)) {
        List<SubTopic> subs = listSubTopics(topic);
        display(subs);
        print("主题过大，请选择子集后重新调用");
        return;
    }

    // 第四步：确认输出目录
    String outputDir = currentDir;  // 默认当前目录
    String wipDir = topic + "-wip/";
    createDir(wipDir);
    // 记录当前 profile，用于压缩恢复
    // 格式：JSON，UTF-8 编码
    //   内置：{"type":"builtin", "domain":"frontend-ui"}
    //   自定义：{"type":"custom", "profile":{...完整 DomainProfile 字段...}}
    if (isBuiltinProfile(profile)) {
        writeFile(wipDir + "profile.meta", {"type":"builtin", "domain": profile.domain});
    } else {
        writeFile(wipDir + "profile.meta", {"type":"custom", "profile": profile});
    }
    // 读取容错：未知字段忽略；解析失败则视为无 profile，回到 selectProfile 重新选择

    // 第五步：递归展开
    Proposition rootProp = buildRootProposition(topic, profile);
    rootProp.ancestorResearchPaths = [];  // 根节点无祖先，空链
    rootProp.requiresCrossVerification = true;  // 根节点无父节点，默认需要交叉验证

    // 根节点也是内部节点，必须走完 recursiveUnit 的所有步骤——
    // 包括收到子节点返回后的"整合 WIP"步骤，把 depth-1 汇总进 0-root-*.md。
    // 只有这一步完成后，才能进入 selfCheck。
    NodeResult rootResult = runAgent(recursiveUnit(rootProp, 0, "root", profile));
    // 此时 0-root-*.md 已包含整棵树的层层汇总内容，
    // 只需读取这一个文件。不要跨层扫描所有 depth 的文件。
    Node tree = buildTreeFromWIP(rootResult, wipDir);

    // 第六步：全局自检
    // 数据来源是已汇总的根节点 WIP，不是重新扫描所有文件
    selfCheck(tree, profile);

    // 第七步：执行自检修改
    applyFixes(tree, profile);

    // 第八步：输出文档
    writeOutput(tree, topic, profile);
}

// ============================================================
// 递归单元 — 所有节点执行的统一行为（核心）
// ============================================================
// 这是整个框架的核心。根节点、内部节点、叶节点都执行同一逻辑，
// 区别仅在于：根节点没有父节点（不上报纠错），叶节点不继续递归。
//
// WIP 文件：完整节点数据的存储通道
// 返回值（NodeResult）：仅传 meta + briefSummary + 成功/失败/纠错信号
// 父节点用返回值做快速汇总和纠错判断；需要详细内容时读 WIP 文件
//
// WIP 文件命名规则：
//   节点内容：  {topic}-wip/{depth}-{parentName}-{selfName}.md
//   调研成果：  {topic}-wip/{depth}-{parentName}-{selfName}.research.md
//
// 例如：todo-app-wip/0-root-root.md              ← 节点内容（自底向上汇总）
//       todo-app-wip/0-root-root.research.md      ← 调研成果（自顶向下传递）
//       todo-app-wip/1-root-页面结构.md
//       todo-app-wip/1-root-页面结构.research.md
//       todo-app-wip/2-页面结构-任务列表.md
//       todo-app-wip/2-页面结构-任务列表.research.md
//
// 双向通道：
//   .research.md — 自顶向下：父节点调研后写入，子节点启动时读取，站在祖先肩膀上调研
//   .md          — 自底向上：子节点完成后写入，父节点汇总时读取
//
// 每个节点完成后将完整结果写入对应 WIP 文件
// 父节点通过文件名模式 "{depth+1}-{selfName}-*.md" 找到并读取所有子节点文件

NodeResult recursiveUnit(Proposition prop, int depth, String parentName, DomainProfile profile) {

    // 步骤 0：继承祖先知识 — 读取祖先调研成果
    // 子节点站在祖先肩膀上，不重复调研已有知识
    //
    // 读取策略（控制上下文开销）：
    //   优先读直接父节点的 research 文件（链中最后一个），因为父节点已经
    //   继承并确认了更上层祖先的知识。只有当父节点的 research 不足以
    //   覆盖本命题需要的信息时，才沿链向上追溯更早的祖先。
    //   避免无差别读取全部祖先文件导致上下文膨胀。
    Map<String, Research> ancestorKnowledge = {};
    if (prop.ancestorResearchPaths != null && prop.ancestorResearchPaths.length > 0) {
        // 先读直接父节点（链中最后一个）
        String parentResearchPath = prop.ancestorResearchPaths[prop.ancestorResearchPaths.length - 1];
        ancestorKnowledge.put(parentResearchPath, readResearchFile(parentResearchPath));

        // 如果父节点 research 不足以覆盖本命题，按需向上追溯
        // 智能体自主判断是否需要读更多祖先——不是机械地全读
    }
    // ancestorKnowledge 中的知识，子节点可以：
    //   1. 直接复用祖先已确认的事实、定义、数据，不再重复搜索
    //   2. 识别祖先调研中与自己命题相关的部分，聚焦增量调研
    //   3. 发现祖先调研中的错误或过时信息时，通过纠错机制上报

    // 步骤 1：调研 — 在祖先知识基础上增量调研
    Research research = doResearch(prop, profile, ancestorKnowledge);
    // 调研策略：
    //   1. 先检查 ancestorKnowledge 中是否已覆盖本命题需要的信息
    //   2. 已有的知识直接复用，不重复搜索
    //   3. 仅对祖先未覆盖的部分进行增量调研
    //   4. 调研方式由 profile.researchMethods 决定：
    //      "web"  → 联网搜索，优先官方文档和权威来源
    //      "code" → 读取代码文件（prop.context 中指定路径）
    //      "docs" → 读取项目文档（prop.context 中指定路径）
    //      "pdf"  → 读取 PDF 文件（每次最多 20 页）

    // 步骤 1.5：交叉验证 — 对关键事实进行独立信息源验证
    // 仅当父节点要求交叉验证且调研方式包含 "web" 时执行
    // 父节点在命题时通过 prop.requiresCrossVerification 控制，
    // 方向清晰、不证自明、或低重要性的子节点可跳过，节省算力
    if (prop.requiresCrossVerification && profile.researchMethods.contains("web")) {
        // 从调研结果中提取关键事实（定义、数据、因果关系等）
        List<String> keyClaims = extractKeyClaims(research);

        research.verifications = [];
        for (String claim : keyClaims) {
            CrossVerification cv = new CrossVerification();
            cv.claim = claim;

            // 使用不同搜索词/来源进行验证
            // 要求至少 2 个独立信息源一致才算"已验证"
            cv.sources = searchIndependentSources(claim);
            cv.verified = (cv.sources.length >= 2 && sourcesAgree(cv.sources, claim));

            if (!cv.verified) {
                cv.note = cv.sources.length < 2
                    ? "仅找到 " + cv.sources.length + " 个信息源，不足以交叉验证"
                    : "多个信息源之间存在不一致";
            }

            research.verifications.add(cv);
        }
    }

    String selfName = research.confirmedName;

    // 步骤 2：验证 — 命题是否准确
    // 注意：必须先验证再持久化 research，避免验证失败时留下孤儿文件
    if (!research.validates(prop)) {
        // 向父节点上报纠错（不写 research 文件，因为本次调研否定了命题）
        return NodeResult.error(new ErrorReport(
            errorType:  research.errorType,
            detail:     research.mismatch,
            suggestion: research.suggestFix
        ));
    }

    // 步骤 2.5：持久化调研成果 — 验证通过后写入 .research.md 供子节点继承
    // 注意：仅当后续判断为内部节点时，research 文件才有消费者（子节点）。
    // 但判断在步骤 3 才发生，此处先写入，若最终为叶节点则文件无害（清理时随 WIP 目录一起删除）。
    // 这样做的好处是：步骤 5 构建 childAncestorPaths 时可以直接引用 researchFilePath，逻辑更简洁。
    String researchFilePath = writeResearchFile(depth, parentName, selfName, research);
    // 文件内容包含：confirmedName、definition、关键发现、数据来源
    // 以及从祖先继承并确认仍然有效的知识（标注来源祖先）
    // 以及交叉验证结果（如有），格式：
    //
    // ## 交叉验证
    // | 事实 | 来源数 | 状态 | 备注 |
    // |------|--------|------|------|
    // | xxx  | 3      | ✅    |      |
    // | yyy  | 1      | ⚠️ 未完成 | 仅找到单一来源 |

    // 深度提醒：MAX_DEPTH 不是硬上限，而是提醒信号。
    // 超过时智能体应意识到自己已经处于很深的层级，
    // 如无必要应降低颗粒度、倾向于作为叶节点处理。
    // 但如果调研后确实需要继续拆分（内容复杂、不可合并），
    // 那么多深都可以继续——深度服从内容需要，不是反过来。
    if (depth >= MAX_DEPTH) {
        // 提醒自己：当前已很深，重新审视是否真有必要继续拆分
        // 若决定继续下钻，需在 WIP 文件头部记录理由
        recheck(research);
    }

    // 步骤 3：判断 — 叶节点还是内部节点
    if (isLeaf(research, profile)) {

        // 步骤 4：叶节点 — 充分展开内容
        Node leaf = new Node();
        leaf.isLeaf = true;
        leaf.name = research.confirmedName;

        // 按 profile.outputFormat 充分展开
        // 关键：叶节点独享完整上下文，必须充分利用
        // 不是写摘要，而是写完整、详细、可直接使用的内容
        leaf.summary = expandLeafContent(research, profile);
        leaf.attributes = fillDomainAttributes(research, profile);

        // 将完整结果写入 WIP 文件
        writeWIPFile(depth, parentName, leaf.name, leaf);

        // 返回值只传 meta（轻量信号）
        return NodeResult.successMeta(leaf);

    } else {

        // 步骤 5：内部节点 — 为子节点命题，递归继续
        Node internal = new Node();
        internal.isLeaf = false;

        // 为子节点命题
        // 构建子节点的祖先调研链：当前祖先链 + 自己的 research 文件
        String[] childAncestorPaths = append(prop.ancestorResearchPaths, researchFilePath);

        List<Proposition> childProps = proposeChildren(research, profile);
        // 子节点数量至少 2 个，上限由结构决定
        // 每个子命题必须包含：name, scope, boundary, context, ancestorResearchPaths
        // 同层兄弟节点名称必须唯一（用于 WIP 文件寻址），重名时附加限定词区分
        // ancestorResearchPaths 统一设为 childAncestorPaths（所有兄弟共享同一祖先链）
        for (Proposition p : childProps) {
            p.ancestorResearchPaths = childAncestorPaths;

            // 父节点决定每个子节点是否需要交叉验证
            // 需要交叉验证的场景：涉及有争议的事实、量化数据、因果论断、非主流观点
            // 可跳过的场景：方向清晰的定义/分类、业界公认的标准、不证自明的逻辑、低重要性节点
            p.requiresCrossVerification = needsCrossVerification(p, research, profile);
        }

        // 派 subagent 并行处理每个子节点
        List<NodeResult> results = parallelDispatch(
            childProps,
            (p) -> runAgent(recursiveUnit(p, depth + 1, selfName, profile))
        );
        // 执行策略：同一父节点的子节点在单条消息中发起多个 Task 调用

        // 处理返回结果
        for (int i = 0; i < results.size(); i++) {
            NodeResult r = results[i];

            if (!r.success) {
                // 子节点上报纠错
                int corrections = 0;
                while (!r.success && corrections < MAX_CORRECTION) {
                    Proposition fixed = correctProposition(childProps[i], r.error);
                    fixed.ancestorResearchPaths = childAncestorPaths;  // 确保纠错命题继承祖先链

                    // 如果修正影响兄弟节点边界
                    // 轻微（仅边界描述变化）→ 调整兄弟命题的 boundary
                    // 实质（内容范围变化）→ 受影响兄弟需重新产出并替换旧结果后再汇总
                    checkSiblingBoundaries(fixed, childProps);

                    r = runAgent(recursiveUnit(fixed, depth + 1, selfName, profile));
                    corrections++;
                }
                if (!r.success) {
                    // 超过纠错上限，强制定稿。最低质量要求：
                    // - 必须写明当前采用的假设
                    // - 必须标注证据不足或存疑的部分
                    // - 必须列出后续待查项（供全局自检或用户后续处理）
                    r = forceFinalize(childProps[i], r.error);
                }
                results[i] = r;
            }
        }

        // 汇总
        internal.name = selfName;
        internal.children = extractNodesFromMeta(results);
        internal.summary = summarize(internal.children);
        internal.attributes = aggregateAttributes(internal.children, profile);

        // 汇总时检查重叠和遗漏
        if (hasOverlapOrGap(internal.children)) {
            fixOverlapOrGap(internal, profile);
        }

        // 父子合并：命题时要求至少 2 个子节点，但纠错过程中可能合并或淘汰，
        // 导致最终只剩 1 个有效子节点。此时将父子合并为一个节点，消除冗余层级。
        if (internal.children.length == 1) {
            Node merged = merge(internal, internal.children[0]);
            writeWIPFile(depth, parentName, merged.name, merged);
            return NodeResult.successMeta(merged);
        }

        // 整合 WIP（关键步骤 — 不可跳过）
        //
        // 这一步是递归汇总的物化。本节点把子节点内容汇总进自己的 WIP 文件，
        // 这样本节点的父节点只需读本节点的汇总文件，不需要跨层读取孙节点。
        // 层层向上，最终根节点的 WIP 文件（0-root-*.md）包含整棵树的完整内容。
        //
        // 根节点也是内部节点，也会走到这里。根节点在这一步把所有 depth-1
        // 子节点汇总进 0-root-*.md 后，main() 的 selfCheck 和 writeOutput
        // 才有完整的数据来源。如果跳过，后续阶段将被迫一次性读取所有层级
        // 的所有文件，上下文被挤占，违背"每个节点独享完整上下文"的核心哲学。
        //
        // 执行方式：读一个子节点 WIP、append 到本节点 WIP、释放，逐个处理，
        // 避免所有子节点内容同时驻留上下文。
        writeWIPHeader(depth, parentName, internal.name, internal);
        for (NodeResult r : results) {
            String childWIP = readWIPFile(depth + 1, internal.name, r.name);
            appendToWIP(depth, parentName, internal.name, childWIP);
        }

        return NodeResult.successMeta(internal);
    }
}

// ============================================================
// 叶节点判断（通用标准 + 领域补充）
// ============================================================

boolean isLeaf(Research research, DomainProfile profile) {

    // 通用标准 1：能否用一段话完整定义，不含分支词？
    // 分支词："以及""另外""同时""还有""一方面...另一方面""有两种""根据情况"
    if (containsBranchingWords(research.definition)) {
        return false;
    }

    // 通用标准 2：尝试写一段完整输出，是否不得不覆盖多个独立关注点？
    if (mixesMultipleIndependentConcerns(research)) {
        return false;
    }

    // 通用标准 3：上下文预算 — 一个 subagent 能否在一个上下文窗口内
    // 完整、充分地处理这个节点（不是写摘要，而是写详细内容）
    if (!fitsInSingleContext(research)) {
        return false;
    }

    // 领域特定补充规则
    if (profile.leafCriteria.splitSignals != null) {
        for (String signal : profile.leafCriteria.splitSignals) {
            if (research.contains(signal)) {
                // 触发拆分信号，重新审视（不自动推翻）
                recheck(research, signal);
            }
        }
    }

    // 辅助规则（满足则重新审视）：
    // - 兄弟节点普遍简短，此节点明显更复杂（粗细不一致）
    // - 展开内容需要引入多个当前树中未出现的新概念
    if (inconsistentWithSiblings(research) || introducesTooManyNewConcepts(research)) {
        recheck(research);
    }

    // recheck 是提醒智能体重新审视，不是机械的循环或自动否决。
    // 智能体综合以上所有信号（硬条件 + 领域信号 + 兄弟对比），自主做出最终判断。
    // 如果审视后认为确实该拆分，智能体应返回 false；认为是原子单元则返回 true。
    return selfJudgment;
}

// ============================================================
// 全局自检
// ============================================================

void selfCheck(Node tree, DomainProfile profile) {
    // 自底向上汇总完成后，对整棵树做全局一致性检查
    // 能修复的直接修复，不输出过程，不通知用户
    // 仅内容存疑或结构有重大问题时询问用户

    traverse(tree, (node) -> {
        checkLeafJudgment(node, profile);  // 叶节点是否真正是原子单元
        checkCompleteness(node);           // 高重要性部分是否充分展开
        checkLayerConsistency(node);       // 子节点与父节点命题一致，兄弟间无重叠/遗漏
        checkContentDepth(node);           // 叶节点内容是否充分（不是摘要）
        checkResearchCoverage(node);       // 每个叶节点都经过调研验证
        checkProvisionalNodes(node);       // forceFinalize 产生的节点：假设/存疑/待查项是否完整，
                                           // 证据可补齐则补齐，否则在最终文档显式标注风险
        checkCrossVerification(node);      // 交叉验证覆盖率检查：
                                           //   - 统计未验证事实数量
                                           //   - 全部关键事实均未验证 → 标注为高风险
                                           //   - 汇总为文档末尾的验证覆盖率统计

        // 领域特定检查
        for (String check : profile.qualityChecks) {
            runQualityCheck(node, check);
        }
    });
}

// ============================================================
// 输出文档
// ============================================================

void writeOutput(Node tree, String topic, DomainProfile profile) {
    String filename = topic + ".md";

    // 已有同名文件 → 备份旧版
    if (exists(filename)) {
        String timestamp = formatDate(now(), "yyyyMMdd-HHmm");
        mv(filename, topic + "." + timestamp + ".bak.md");
    }

    // 文档结构（按顺序写入）：
    write(filename, [
        buildHeader(topic, profile),       // ① 标题 + 领域 + 生成时间
        buildOverview(tree),               // ② 概览：节点总数、树深度、领域、主要分支概述
        buildASCIITree(tree),              // ③ 知识树 ASCII：标注 叶/内部、层级
        buildNodeDetails(tree),            // ④ 节点详情（深度优先先序遍历）
    ]);

    // 摘要（对话输出，不写入文档）
    print("文件路径、节点总数（叶/内部）、树深度");

    // 保留 WIP 目录：合并完成后不删除中间产物
    // WIP 文件可用于调试、回溯、二次编辑，用户可手动清理
    // if (writeSucceeded) {
    //     deleteDir(topic + "-wip/");
    // }
}

// ============================================================
// 节点详情输出格式
// ============================================================

// 内部节点：
// ## {depth 对应的 Markdown 标题级别} {name}
// {summary — 核心问题概括}
//
// 叶节点：
// ## {depth 对应的 Markdown 标题级别} {name}
// {summary — 充分展开的完整内容，按 profile.outputFormat 组织}
// {attributes — 按 profile.nodeAttributes 中定义的字段顺序展示}
// {若该节点有任何 verified=false 的交叉验证事实，在末尾添加标注：}
// > ⚠️ 以下内容未完成独立信息源交叉验证：
// > - {未验证事实1}（{note}）
// > - {未验证事实2}（{note}）
//
// 深度优先先序：先写父节点，再依次写每个子树

// ============================================================
// 智能体执行入口
// ============================================================
// 这不是真正的软件，最终执行者是 AI 智能体。
// 所有伪代码中的函数调用最终都由智能体根据上下文理解并执行。

NodeResult runAgent(SubagentDispatch dispatch) {
    // 智能体是最终执行者。每个智能体启动时接收两部分输入：
    //
    // 1. 本 SKILL 文件的绝对路径 + 读取指令
    //    prompt 中必须包含：
    //    "先读取 /Users/taoyawei/.codex/skills/recursive-think/SKILL.md，
    //     理解完整流程后再执行任务。"
    //
    // 2. 任务数据（this.context）— 智能体工作的具体输入，包括：
    //    - 父节点下发的命题（Proposition: 名称、范围、边界、上下文、祖先调研路径链）
    //      其中 ancestorResearchPaths 是祖先调研文件路径列表（从根到父有序），
    //      智能体启动后按步骤 0 读取这些文件，继承祖先知识再做增量调研
    //    - depth（当前层级）
    //    - parentName（父命题名称）
    //    - wipDir（WIP 目录路径）
    //    - profile（领域 Profile，或其关键字段摘要）
    //
    // 智能体根据 SKILL 定义的逻辑 + context 中的数据自主执行。
    // 需要继续递归时通过 Codex 原生 collaboration.spawn_agent 派 subagent，
    // 在 prompt 中写明角色职责；每个 subagent 同样接收 SKILL 路径 + 自己的 context，执行 recursiveUnit。
}

// ============================================================
// 通用规则
// ============================================================
// - recursive-think 是思考工具，不启动开发流程
// - 输出是结构化文档，用户可将其交给敏捷/团队模式执行
// - 叶节点内容必须"充分展开"——不是摘要，而是可直接使用的详细内容
// - 每个叶节点独享完整上下文能力，必须充分利用
// - WIP 文件是递归过程的中间产物，最终文档生成后保留（不自动删除），用户可手动清理
// - 规模过大时必须提示用户缩小范围（成本控制）
//
// ── WIP 目录的定位（重要）──
// WIP 目录（*-wip/）是调研的中间产物，是重要参考，但**不是输出文档，也不是记录知识的媒介**。
// 一旦递归工作完成（writeOutput 生成最终文档后），WIP 目录即冻结：
//   - 后续工作（即使是对同一主题的重新调研）不再更新 WIP 中的文件
//   - WIP 可被引用、参考，但不作为活跃文档维护
//   - 如果需要重新调研，启动新的递归流程生成新的 WIP 目录
//   - 最终产物（writeOutput 的输出文件）才是正式文档，后续迭代更新最终产物
```
