---
name: knowledge-decompose
description: 将学习主题拆解为知识树，支持拆解、教学、训练三种模式，产出 MD 文档、图表引用表、进度 CSV
---

// 本文件是伪代码，不是可执行程序。
// 用伪代码代替自然语言来规范业务流程，因为自然语言歧义太多。
// 智能体应理解伪代码的意图并执行，而非逐字翻译为代码。

```java
// ============================================================
// 常量与配置
// ============================================================

final String[] FORBIDDEN_DIRS = {"/", "~", "~/Desktop", "~/Downloads", "~/Documents", "/tmp"};
final int MAX_DEPTH = 6;           // 树深度上限 不是硬规则
final int MAX_CORRECTION = 2;      // 同一子节点最多纠错轮数
final int MAX_LEAF_TIME = 10;      // 叶节点预计学习时间上限（分钟）
final int SAMPLE_Q_COUNT = 3;      // 每个叶节点 sample_questions 数量（2~3）
final int PDF_PAGE_LIMIT = 20;     // PDF 每次最多读取页数
final int HISTORY_MAX = 10;        // 答题历史保留条数

// ============================================================
// 数据结构
// ============================================================

class Frontmatter {
    String topic;
    int version;
    String generated;       // YYYY-MM-DD
    String language;        // "zh" | "en" | 其他
    String region;          // "none" | "us" | "uk" | 其他
}

enum Importance { 高, 中, 低 }
enum Difficulty { 入门, 中级, 高级 }

class CrossVerification {
    String claim;           // 关键事实/论断
    String[] sources;       // 独立信息源列表（URL 或来源描述）
    boolean verified;       // 是否完成交叉验证（≥2 个独立信息源一致）
    String note;            // 不一致或无法验证时的说明
}

class Proposition {
    String name;            // 暂定名称
    String scope;           // 预期覆盖范围
    String boundary;        // 与兄弟节点的边界说明
    String pageRange;       // 教材页码范围（如有），如 "35-52"
    String[] ancestorResearchPaths;  // 祖先调研文件路径链（从根到父，自顶向下有序）
                                     // 子节点调研前先读这些文件，复用已有知识，避免重复调研
    boolean requiresCrossVerification;  // 父节点决定：该子节点是否需要交叉验证
                                        // true → 子节点在调研后执行交叉验证
                                        // false → 跳过交叉验证（方向清晰/不证自明/低重要性）
}

class Node {
    // -- 所有节点 --
    String name;
    String termEn;          // 英文术语，多个逗号分隔
    String termCn;          // 中文术语，多个 / 分隔
    String summary;         // 内部节点：核心问题概括；叶节点：完整知识内容，读完可学
    Importance importance;
    int estimatedTime;      // 分钟
    Difficulty difficulty;
    boolean isLeaf;
    String[] mediaRefs;     // 图表引用编号，如 "togaf#1"，无则空

    // -- 仅内部节点 --
    Node[] children;        // 至少 2 个，上限由知识结构决定

    // -- 仅叶节点 --
    SampleQuestion[] sampleQuestions;
}

class SampleQuestion {
    String question;        // 优先简答题 是否、选择也可以出
    String[] keyPoints;     // 评分要点，1~3 条
    int level;              // 1=复述/识别, 2=推理/对比, 3=应用/诊断
}

// 纠错报告：子节点发现命题有问题时返回给父节点
class ErrorReport {
    String errorType;       // "范围过大" | "范围过小" | "方向错误" | "边界模糊" | "术语不准确"
    String detail;          // 哪里与调研结果不符
    Proposition suggestion; // 建议的修正命题
}

// 递归单元的返回值（轻量信号 + meta，完整数据在 WIP 文件中）
class NodeResult {
    boolean success;        // true=正常返回, false=纠错上报
    ErrorReport error;      // !success 时填充

    // success 时填充以下 meta（父节点用于快速汇总，无需读 WIP 文件）
    String name;
    String termEn;
    String termCn;
    String summary;
    Importance importance;
    int estimatedTime;
    Difficulty difficulty;
    boolean isLeaf;
    String[] mediaRefs;
}

// 进度 CSV 行
class CSVRow {
    String key;             // 节点名称（英文术语优先，无则中文名）
    String taughtVersion;   // 完成教学的 MD 版本号，未教则空
    int batch;              // 上次完成的训练轮次号，初始 0
    String lastQuestion;    // 上次出题（| 转义为 \|）
    String lastAnswer;      // 上次回答（| 转义为 \|）
    String lastPracticed;   // YYYY-MM-DD
    int[] history;          // 最近 10 次答题结果（0/1）
}

// 媒体引用条目
class MediaEntry {
    String id;              // "{topic缩写}#{N}"，如 "togaf#1"
    String description;
    String source;          // URL 或 "PPT 第N页" 或 "教材 第N页"
    String usedBy;          // 节点名称
}

// ============================================================
// 节点类型定义（全文统一）
// ============================================================
// 叶节点 — 无子节点，实际讲解和出题单元
// 内部节点 — 有子节点，组织结构用
// 章 — 无父节点的顶层内部节点
// 组 — 叶节点的直接父节点

// ============================================================
// 全局规则
// ============================================================

void onCompactDetected() {
    // 上下文被压缩时立即执行，恢复完成前禁止任何操作
    reread("skill.md");

    List<File> mdFiles = scanKnowledgeTreeMDs();  // 排除 *-media.md
    if (mdFiles.size() > 1) {
        selectFile(mdFiles);  // 先让用户选定文件
    }

    // 读取已有文件恢复状态
    for (File md : mdFiles) { reread(md); }
    reread("{主题}-progress.csv");  // 如存在
    rereadDir("{主题}-wip/");       // 如存在（递归拆解中各节点写入的临时文件）
}

// 术语规则：每个节点必须列出所有标准术语，有多个叫法时全部保留
// 语言规则：教材语言和地区偏好在 A0 询问，写入 frontmatter，后续模式沿用

// ============================================================
// 启动流程
// ============================================================

void main() {
    // 第一步：安全检查
    if (currentDir in FORBIDDEN_DIRS) {
        warn("禁止在此目录操作");
        return;  // 立即终止
    }

    // 第二步：扫描已有知识树
    List<File> mdFiles = scanForMDWithFrontmatter();  // 含 topic/version/generated，排除 *-media.md

    // 第三步：显示模式选单
    if (mdFiles.isEmpty()) {
        // 只显示拆解模式
        showMenu(A);
    } else if (mdFiles.size() == 1) {
        selectedFile = mdFiles[0];
        showMenu(A, B, C);  // 三种模式，自动选中该文件
    } else {
        selectedFile = askUserToChoose(mdFiles);
        showMenu(A, B, C);
    }

    switch (userChoice) {
        case A: modeA(); break;
        case B: modeB(); break;
        case C: modeC(); break;
    }
}

// ============================================================
// 模式 A：拆解
// ============================================================

void modeA() {
    // A0. 语言与地区
    Frontmatter fm = new Frontmatter();
    fm.language = ask("语言？zh/en/other");
    fm.region = ask("地区？none/us/uk/other");

    // A1. 规模检查（目的：成本控制，递归拆解会派大量 subagent）
    String topic = extractTopicName();  // 从教材或用户输入提取

    // 过大判定：一级展开后任意子节点是完整学科/独立领域，或某子主题可独立成 3h+ 课程
    if (isTooLarge(topic)) {
        List<SubTopic> subs = listSubTopics(topic);
        display(subs);  // 每条附简短说明
        print("请选择子集后重新调用");
        return;  // 立即终止
    }

    // A2. 递归拆解 —— 根节点执行 recursiveUnit 的完整流程
    Proposition rootProp = buildRootProposition(topic);
    rootProp.ancestorResearchPaths = [];  // 根节点无祖先，空链
    rootProp.requiresCrossVerification = true;  // 根节点无父节点，默认需要交叉验证
    // 根节点命题来源：有教材 → 教材目录/结构；无教材 → 联网搜索

    // 根节点也是内部节点，必须走完 recursiveUnit 的所有步骤——
    // 包括收到子节点返回后的"整合 WIP"步骤，把 depth-1 汇总进 0-root-*.md。
    // 只有这一步完成后，才能进入 selfCheck。
    NodeResult rootResult = runAgent(recursiveUnit(rootProp, 0, "root"));
    // 此时 0-root-*.md 已包含整棵树的层层汇总内容，
    // 只需读取这一个文件。不要跨层扫描所有 depth 的文件。
    Node tree = buildTreeFromWIP(rootResult);

    // A3. 全局自检 —— 数据来源是已汇总的根节点 WIP，不是重新扫描所有文件
    selfCheck(tree);

    // A4. 执行自检修改（一次修复，不重复）
    applyFixes(tree);

    // A5. 输出文档
    writeOutput(tree, fm);
}

// ============================================================
// 递归单元 —— 所有节点执行的统一行为
// ============================================================
// 这是整个拆解系统的核心。根节点、内部节点、叶节点都执行同一逻辑，
// 区别仅在于：根节点没有父节点（不上报纠错），叶节点不继续递归。

// WIP 文件：完整节点数据的存储通道（含 children、sampleQuestions 等详细内容）
// 返回值（NodeResult）：仅传 meta + summary + 成功/失败/纠错信号
// 父节点用返回值做快速汇总和纠错判断；需要详细内容时读 WIP 文件
//
// WIP 文件命名规则：
//   节点内容：  {topic}-wip/{depth}-{parentName}-{selfName}.md
//   调研成果：  {topic}-wip/{depth}-{parentName}-{selfName}.research.md
//
// 例如：togaf-wip/0-root-root.md              ← 节点内容（自底向上汇总）
//       togaf-wip/0-root-root.research.md      ← 调研成果（自顶向下传递）
//       togaf-wip/1-root-ADM-Phases.md
//       togaf-wip/1-root-ADM-Phases.research.md
//       togaf-wip/2-ADM-Phases-Preliminary.md
//       togaf-wip/2-ADM-Phases-Preliminary.research.md
//
// 双向通道：
//   .research.md — 自顶向下：父节点调研后写入，子节点启动时读取，站在祖先肩膀上调研
//   .md          — 自底向上：子节点完成后写入，父节点汇总时读取
//
// 每个节点（含叶节点）完成后将完整结果写入对应 WIP 文件
// 父节点通过文件名模式 "{depth+1}-{selfName}-*.md" 找到并读取所有子节点文件
// 根节点汇总完成后将 wip 目录中的结果合并为正式文档，然后删除 wip 目录

NodeResult recursiveUnit(Proposition prop, int depth, String parentName) {

    // 步骤 0：继承祖先知识 — 读取祖先调研成果
    // 子节点站在祖先肩膀上，不重复调研已有知识
    //
    // 读取策略（控制上下文开销）：
    //   优先读直接父节点的 research 文件（链中最后一个），因为父节点已经
    //   继承并确认了更上层祖先的知识。只有当父节点的 research 不足以
    //   覆盖本命题需要的信息时，才沿链向上追溯更早的祖先。
    Map<String, Research> ancestorKnowledge = {};
    if (prop.ancestorResearchPaths != null && prop.ancestorResearchPaths.length > 0) {
        String parentResearchPath = prop.ancestorResearchPaths[prop.ancestorResearchPaths.length - 1];
        ancestorKnowledge.put(parentResearchPath, readResearchFile(parentResearchPath));
    }
    // ancestorKnowledge 中的知识，子节点可以：
    //   1. 直接复用祖先已确认的术语、定义、概念关系，不再重复搜索
    //   2. 识别祖先调研中与自己命题相关的部分，聚焦增量调研
    //   3. 发现祖先调研中的错误或过时信息时，通过纠错机制上报

    // 步骤 1：调研 — 在祖先知识基础上增量调研
    Research research;
    if (prop.pageRange != null) {
        // 有教材：优先读教材对应页码
        // 祖先已覆盖的术语和定义可直接复用，不需要从 PDF 重新提取
        research = readPDF(prop.pageRange, ancestorKnowledge);  // 每次最多 PDF_PAGE_LIMIT 页
    } else {
        // 无教材：联网调研，优先官方文档和权威来源
        // 祖先已确认的事实不再重复搜索，仅对祖先未覆盖的部分增量调研
        research = webSearch(prop, ancestorKnowledge);
    }

    // 步骤 1.3：交叉验证 — 对关键事实进行独立信息源验证
    // 仅当父节点要求交叉验证时执行
    // 父节点在命题时通过 prop.requiresCrossVerification 控制，
    // 方向清晰、不证自明、或低重要性的子节点可跳过，节省算力
    if (prop.requiresCrossVerification) {
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

    // 步骤 1.5：术语验证（每个节点必须执行，有教材也不跳过）
    // 派一个 sonnet subagent 专门做搜索验证，重点验证：
    //   - termEn / termCn 是否是该领域公认的标准术语
    //   - 术语是否有多种常见叫法（有则全部补入）
    //   - 命题范围与标准定义是否一致
    // 有教材时：搜索范围可以窄（主要验证术语标准性，不重复调研内容）
    // 无教材时：搜索范围宽（同时验证内容和术语）
    // subagent 使用 Codex 当前可用模型，联网搜索权威来源
    TermVerification termVerify = runAgent(
        task: verifyTerms(prop, research),
        model: "inherit-current",
        tools: [Codex web search]
    );

    // 合并验证结果
    research.mergeTermVerification(termVerify);
    // - 术语有误 → research.errorType = "术语不准确"，触发步骤 2 纠错
    // - 有新叫法 → 补入 termEn / termCn
    // - 命题范围与标准定义不符 → 补充到 research.mismatch

    String selfName = prop.name;

    // 步骤 2：命题是否准确？
    // 注意：必须先验证再持久化 research，避免验证失败时留下孤儿文件
    if (!research.validates(prop)) {
        // 向父节点上报纠错（不写 research 文件，因为本次调研否定了命题）
        return NodeResult.error(new ErrorReport(
            errorType:  research.errorType,   // 范围过大/过小/方向错误/边界模糊/术语不准确
            detail:     research.mismatch,     // 具体哪里不符
            suggestion: research.suggestFix    // 建议的新命题
        ));
    }

    // 步骤 2.5：持久化调研成果 — 验证通过后写入 .research.md 供子节点继承
    // 叶节点写入的 research 文件无子节点消费，但无害（随 WIP 清理删除）
    String researchFilePath = writeResearchFile(depth, parentName, selfName, research);
    // 文件内容包含：confirmedName、definition、术语（termEn/termCn）、关键发现、数据来源
    // 以及从祖先继承并确认仍然有效的知识（标注来源祖先）
    // 以及交叉验证结果（如有），格式：
    //
    // ## 交叉验证
    // | 事实 | 来源数 | 状态 | 备注 |
    // |------|--------|------|------|
    // | xxx  | 3      | ✅    |      |
    // | yyy  | 1      | ⚠️ 未完成 | 仅找到单一来源 |

    // 步骤 3：判断叶节点还是内部节点
    if (isLeaf(research)) {

        // 步骤 4：叶节点 —— 递归终止
        Node leaf = new Node();
        leaf.isLeaf = true;
        fillAttributes(leaf, research);       // name, termEn, termCn, summary, importance, ...
        leaf.sampleQuestions = generateQuestions(leaf);
        checkMediaRefs(leaf, research);       // 需要图表时写入 media 引用表

        // 将完整结果写入 WIP 文件（含 sampleQuestions 等详细内容）
        writeWIPFile(depth, parentName, leaf.name, leaf);

        // 返回值只传 meta + summary（轻量信号）
        return NodeResult.successMeta(leaf);

    } else {

        // 步骤 5：内部节点 —— 递归继续
        Node internal = new Node();
        internal.isLeaf = false;

        // 为子节点命题
        // 构建子节点的祖先调研链：当前祖先链 + 自己的 research 文件
        String[] childAncestorPaths = append(prop.ancestorResearchPaths, researchFilePath);

        List<Proposition> childProps = proposeChildren(research);
        // 有教材：基于教材章节内容命题，指定每个子节点的页码范围
        // 无教材：基于调研结果命题
        // 子节点数量至少 2 个，上限由知识结构决定
        // 每个子命题必须包含：name, scope, boundary, pageRange(如有), ancestorResearchPaths
        // ancestorResearchPaths 统一设为 childAncestorPaths（所有兄弟共享同一祖先链）
        for (Proposition p : childProps) {
            p.ancestorResearchPaths = childAncestorPaths;

            // 父节点决定每个子节点是否需要交叉验证
            // 需要交叉验证的场景：涉及有争议的事实、量化数据、因果论断、非主流观点
            // 可跳过的场景：方向清晰的定义/分类、业界公认的标准、不证自明的逻辑、低重要性节点
            p.requiresCrossVerification = needsCrossVerification(p, research);
        }

        // 派 subagent 并行处理每个子节点
        // 每个 subagent 执行同样的 recursiveUnit()
        List<NodeResult> results = parallelDispatch(childProps, (p) -> runAgent(recursiveUnit(p, depth + 1, selfName)));
        // 执行策略：同一父节点的子节点在单条消息中发起多个 Task 调用

        // 处理返回结果
        for (int i = 0; i < results.size(); i++) {
            NodeResult r = results[i];

            if (!r.success) {
                // 子节点上报纠错
                int corrections = 0;
                while (!r.success && corrections < MAX_CORRECTION) {
                    // 综合纠错建议，修正命题
                    Proposition fixed = correctProposition(childProps[i], r.error);
                    fixed.ancestorResearchPaths = childAncestorPaths;  // 确保纠错命题继承祖先链

                    // 如果修正影响兄弟节点边界 → 父节点判断影响程度：
                    // - 轻微（仅边界描述变化）→ 调整兄弟命题的 boundary 字段
                    // - 实质（内容范围变化）→ 重新派 subagent 处理受影响的兄弟
                    checkSiblingBoundaries(fixed, childProps);

                    // 重新下发
                    r = runAgent(recursiveUnit(fixed, depth + 1, selfName));
                    corrections++;
                }
                if (!r.success) {
                    // 超过纠错上限，父节点直接定稿
                    r = forceFinalize(childProps[i], r.error);
                }
                results[i] = r;
            }
        }

        // 汇总：用返回值中的 meta + summary 做快速汇总
        internal.children = extractNodesFromMeta(results);
        fillAttributes(internal, summarize(internal.children));
        // summary：归纳子节点核心问题
        // estimatedTime：累加子节点
        // importance/difficulty：综合判断

        // 汇总时检查重叠和遗漏
        if (hasOverlapOrGap(internal.children)) {
            // 调整边界或补充，重新处理受影响的子节点
            fixOverlapOrGap(internal);
        }

        // 父子合并：内部节点只有唯一子分支且无兄弟时
        if (internal.children.length == 1) {
            Node merged = merge(internal, internal.children[0]);
            writeWIPFile(depth, parentName, merged.name, merged);
            return NodeResult.successMeta(merged);
        }

        // 整合 WIP（关键步骤 — 不可跳过，根节点也不例外）
        //
        // 本节点把子节点内容汇总进自己的 WIP 文件，这样父节点只需读
        // 本节点的汇总文件，不需要跨层读取孙节点。层层向上，最终根节点
        // 的 WIP 文件（0-root-*.md）包含整棵树的完整内容，selfCheck
        // 和 writeOutput 才有完整的数据来源。
        //
        // 执行方式：读一个子节点 WIP、append 到本节点 WIP、释放，逐个处理，
        // 避免所有子节点内容同时驻留上下文。
        writeWIPHeader(depth, parentName, internal.name, internal);  // 写本节点头部
        for (NodeResult r : results) {
            String childWIP = readWIPFile(depth + 1, internal.name, r.name);  // 读一个子节点 WIP
            appendToWIP(depth, parentName, internal.name, childWIP);           // 立即 append
        }
        // 全部 append 完毕后再返回

        // 返回值只传 meta + summary
        return NodeResult.successMeta(internal);
    }
}

// ============================================================
// 叶节点判断
// ============================================================

boolean isLeaf(Research research) {
    // 第一步：能否用一句话定义，且不含分支词？
    // 分支词："以及"、"有两种"、"根据情况" 等
    if (containsBranchingWords(research.definition)) {
        return false;  // 按分支拆解
    }

    // 第二步：强行只出一道题，是否混测多个子概念？
    if (mixesMultipleConcepts(research)) {
        return false;  // 拆解
    }

    // 第三步：estimated_time ≤ MAX_LEAF_TIME？
    if (research.estimatedTime > MAX_LEAF_TIME) {
        // 超过 → 回到第一步重新审视
        // 但不自动推翻（记忆性内容多但易学的节点可保留）
        recheck(research);
    }

    // 辅助规则（满足则重新审视）：
    // - 解释此节点需引入 2 个以上本树中尚未出现的新概念
    // - 兄弟节点普遍 5 分钟，此节点估算 15 分钟（粗细不一致）
    if (introducesTooManyNewConcepts(research) || inconsistentWithSiblings(research)) {
        recheck(research);
    }

    // recheck 是一次性提醒，不是循环。叶节点判断由本节点自主决定：
    // 调研后认为自己是原子概念就是叶节点，以上检查仅为辅助参考。
    return true;
}

// ============================================================
// 出题
// ============================================================

SampleQuestion[] generateQuestions(Node leaf) {
    // 每个叶节点 2~3 道，优先简答题，是否/选择也可以出
    // 必须覆盖至少两层：
    SampleQuestion[] questions = new SampleQuestion[SAMPLE_Q_COUNT];

    questions[0] = generate(leaf, level=1);  // 必须：复述/识别 — 什么是X / X什么时候发生
    questions[1] = generate(leaf, level=2);  // 必须：推理/对比 — 为什么 / X和Y有什么区别
    questions[2] = generate(leaf, level=3);  // 推荐：应用/诊断 — 给出场景，要求判断或修正

    // 每道题附评分要点（1~3 条核心要素）

    // 出题自检
    for (SampleQuestion q : questions) {
        // 只见过这个词但不理解的人能答对吗？能 → 改写
        if (canAnswerWithoutUnderstanding(q)) { rewrite(q); }
        // 测的是父节点内容而非此叶节点独有内容？→ 改写
        if (testsParentContent(q, leaf)) { rewrite(q); }
    }

    return questions;
}

// ============================================================
// 图表引用表
// ============================================================

void checkMediaRefs(Node node, Research research) {
    // 遇到需要图表/电路图/解剖图/分子结构/公式推导图等才能完整理解时触发
    if (!research.needsVisual) return;

    MediaEntry entry = new MediaEntry();
    entry.id = topicAbbrev + "#" + nextMediaIndex();  // 如 "togaf#1"
    entry.usedBy = node.name;

    if (research.hasInputImage) {
        entry.source = "教材 第" + research.imagePage + "页";
    } else {
        entry.source = buildGoogleSearchURL(research.visualDescription);
    }

    appendToFile("{主题}-media.md", entry);  // 只增不减
    node.mediaRefs.add(entry.id);
    node.summary += "（参见 " + entry.id + "）";
    // 遇到 mediaRefs 时展示 URL，提示用户截图保存
}

// ============================================================
// 全局自检（A3）
// ============================================================

void selfCheck(Node tree) {
    // 自底向上汇总完成后，对整棵树做全局一致性检查
    // 能修复的直接修复，不输出过程，不通知用户
    // 仅知识内容存疑或权威性不确定时询问用户

    traverse(tree, (node) -> {
        checkLeafJudgment(node);       // 一句话定义，≤10分钟，不混测
        checkQuestionQuality(node);    // 覆盖两层，测本节点独有内容
        checkCompleteness(node);       // 高重要性概念全覆盖，术语双语完整
        checkLayerConsistency(node);   // 子节点 summary 与父节点命题一致，兄弟间无重叠/遗漏
        checkResearchCoverage(node);   // 每个叶节点都经过 subagent 调研验证
        checkCrossVerification(node);  // 交叉验证覆盖率检查：
                                       //   - 统计未验证事实数量
                                       //   - 全部关键事实均未验证 → 标注为高风险
                                       //   - 汇总为文档末尾的验证覆盖率统计
    });
}

// ============================================================
// 执行自检修改（A4）—— 一次修复，不重复
// ============================================================

void applyFixes(Node tree) {
    // 叶节点判断问题 → 按分支拆解
    // 题目质量问题 → 重写
    // 缺失节点 → 补充属性
    // 层间不一致 → 修正子节点或调整父节点命题
}

// ============================================================
// 输出文档（A5）
// ============================================================

void writeOutput(Node tree, Frontmatter fm) {
    String filename = fm.topic + ".md";

    // 已有同名文件 → 备份旧版
    if (exists(filename)) {
        mv(filename, fm.topic + ".v" + readVersion(filename) + ".md");
    }

    // 文档结构（按顺序写入）：
    write(filename, [
        fm,                                    // ① frontmatter (YAML)
        buildOverview(tree),                   // ② 概览：章节数、知识点总数、总学习时间、难度分布、前置知识
        buildASCIITree(tree),                  // ③ 知识树 ASCII：每节点标注 叶/内部、重要性、术语双语
        buildNodeDetails(tree),                // ④ 节点详情（深度优先先序）
                                               //    叶节点末尾：若有 verified=false 的交叉验证事实，标注：
                                               //    > ⚠️ 以下内容未完成独立信息源交叉验证：
                                               //    > - {未验证事实1}（{note}）
                                               //    > - {未验证事实2}（{note}）
        buildLearningPath(tree),               // ⑤ 建议学习路径：重要性高优先 + 难度入门优先 + 前置依赖
    ]);

    // ⑥ 摘要（对话输出，不写入文档）
    print("文件路径、章节数、知识点数、学习时间、前置知识");

    // ⑦ 生成/更新进度 CSV
    writeProgressCSV(tree, fm);

    // 保留 WIP 目录（递归拆解过程中各节点写入的中间产物），不删除
    // WIP 文件可用于调试、回溯、二次编辑，用户可手动清理
    // deleteDir("{主题}-wip/");  // 不再自动删除
}

// ============================================================
// 进度 CSV
// ============================================================

void writeProgressCSV(Node tree, Frontmatter fm) {
    String csvFile = fm.topic + "-progress.csv";
    // 分隔符：|
    // 第一行：current_batch=0|current_version=1
    // 第二行：列标题
    // 第三行起：数据
    // 转义：last_question 和 last_answer 中的 | 替换为 \|

    if (!exists(csvFile)) {
        // 首次生成：所有叶节点建行，除 key 外留空，batch=0
        createCSV(csvFile, tree.allLeaves(), fm.version);
    } else {
        int csvVersion = readCSVVersion(csvFile);
        if (csvVersion < fm.version) {
            // 进度表升级：按 key 匹配
            upgradeCSV(csvFile, tree.allLeaves(), fm.version);
            // 匹配上 → 保留历史字段
            // 新增节点 → 追加
            // 消失节点 → 删除
            // 更新第一行版本号
        }
        // 版本一致：新节点追加，已有保留，消失删除
    }
}

// ============================================================
// 模式 B：教学
// ============================================================

void modeB() {
    // B1. 启动检查
    int csvVersion = readCSVVersion(csvFile);
    int mdVersion = readMDVersion(mdFile);

    if (csvVersion != mdVersion) {
        print("版本不一致，是否先升级进度表？");
        if (userConfirms()) { upgradeCSV(); }
    }

    // 打印知识树（含已教/待教标记）
    // 已教判定：taught_version == csvVersion
    printTreeWithStatus(tree, csvVersion);
    List<Node> scope = askLearningScope();  // 用户选择学习范围

    // B2~B5. 逐节点教学
    for (Node group : scope.groups()) {       // 按组遍历
        for (Node leaf : group.leaves()) {
            // B2. 讲解
            teach(leaf);  // Agent 自主选择讲解方式，语言与 frontmatter.language 一致

            // B3. 即时测验
            boolean passed = false;
            while (!passed) {
                // 动态出题：基于 summary + 评分要点
                // 不照搬 sampleQuestions，角度不同于 last_question
                String question = generateDynamicQuestion(leaf);
                String answer = getUserAnswer();
                boolean correct = evaluate(answer, leaf);

                // 回写 CSV（每题立即写入文件，防止中途丢失）
                updateCSV(leaf, question, answer, correct);

                if (correct) {
                    leaf.csvRow.taughtVersion = csvVersion;  // 标记已教
                    passed = true;
                } else {
                    // 换角度重新讲解再测
                    reteach(leaf);
                    // 若用户持续卡住 → 主动询问是否跳过或换方式
                }
            }
        }

        // B4. 组测验 —— 完成一组后触发
        groupQuiz(group);
        // 每个叶节点出一道题（importance=高 额外多一题）
        // 连续出题后统一评分，每题回写 CSV
        // 未通过节点补出一道题，补题同样回写
        // 持续未通过 → 主动询问
    }

    // B5. 章测验 —— 完成一章后触发
    for (Node chapter : scope.chapters()) {
        chapterQuiz(chapter);
        // 规则同组测验，额外显示错误率高的知识点列表
    }

    // B6. 教学完成
    if (allNodesTaught()) {
        print("全部完成，建议进入训练模式");
    }
}

// ============================================================
// 模式 C：训练
// ============================================================

void modeC() {
    // C1. 启动检查
    int csvVersion = readCSVVersion(csvFile);
    int mdVersion = readMDVersion(mdFile);
    if (csvVersion != mdVersion) {
        print("版本不一致，请先升级进度表");
        return;
    }

    int currentBatch = readCurrentBatch(csvFile);

    // 检查上次未完成
    List<Node> unfinished = findNodes(n -> n.csvRow.batch < currentBatch);
    if (!unfinished.isEmpty()) {
        print("上次未完成：已答" + countFinished() + "，未答" + unfinished.size());
        printList(unfinished);
        String choice = ask("继续上次 / 新训练轮次？");

        if (choice == "继续") {
            runTraining(unfinished);  // 直接出未完成的节点
            return;
        }
    }

    // 打印知识树（含各节点答题次数和正确率）
    printTreeWithStats(tree);
    List<Node> scope = askTrainingScope();

    // C2. 新训练轮次
    currentBatch++;
    writeCurrentBatch(csvFile, currentBatch);

    // 选中节点 batch-1（使其 < currentBatch，标记待答）
    for (Node n : scope) { n.csvRow.batch--; }
    // 未选中节点 batch 不动

    shuffle(scope);  // 随机排列顺序

    // C3. 出题
    runTraining(scope);
}

void runTraining(List<Node> nodes) {
    int currentBatch = readCurrentBatch(csvFile);

    for (Node leaf : nodes) {
        // 动态出题：角度不同于 last_question，层次随机选 复述/推理/应用
        String question = generateDynamicQuestion(leaf);
        String answer = getUserAnswer();
        boolean correct = evaluate(answer, leaf);

        // 回写 CSV（每题立即写入文件，防止中途丢失）
        leaf.csvRow.batch = currentBatch;
        leaf.csvRow.lastQuestion = question;
        leaf.csvRow.lastAnswer = answer;
        leaf.csvRow.lastPracticed = today();
        appendHistory(leaf.csvRow, correct);  // 超 HISTORY_MAX 丢弃最旧
    }

    // C4. 完成
    printResults(nodes);  // 正确率
    printWeakSpots(nodes);  // 连续错误 ≥ 2 次的知识点
    ask("是否再来一轮？");
}

// ============================================================
// 智能体执行入口
// ============================================================
// 这不是真正的软件，最终执行者是 AI 智能体。
// 所有伪代码中的函数调用最终都由智能体根据上下文理解并执行。

NodeResult runAgent(SubagentDispatch dispatch) {
    // 智能体是最终执行者。每个智能体启动时接收两部分输入：
    //
    // 1. 本 skill 文件的绝对路径 + 读取指令 — 智能体必须先读取此文件再执行
    //    prompt 中必须包含："先读取 {SKILL.md 绝对路径}，理解完整流程后再执行任务。"
    // 2. 任务数据（this.context） — 智能体工作的具体输入，包括：
    //    - 拆解模式：父节点下发的命题（Proposition: 名称、范围、边界、祖先调研路径链）、
    //      其中 ancestorResearchPaths 是祖先调研文件路径列表（从根到父有序），
    //      智能体启动后按步骤 0 读取这些文件，继承祖先知识再做增量调研。
    //      depth（当前层级）、parentName（父命题名称）、教材页码范围、
    //      wip 目录路径（用于写入自己的结果文件和读取子节点文件）
    //    - 教学模式：目标叶节点的 summary、sampleQuestions、CSV 当前状态
    //    - 训练模式：待练节点列表、CSV 历史记录
    //
    // 智能体根据 skill 定义的逻辑 + this.context 中的数据自主执行。
    // 拆解模式下通过 Codex 原生 collaboration.spawn_agent 派 subagent，
    // 在 prompt 中写明角色职责；每个 subagent 同样接收 skill 路径 + 自己的 context，执行 runAgent。
    //
    // 术语验证 subagent（步骤 1.5）使用 Codex 当前可用模型，
    // task 描述格式：
    //   "搜索验证以下命题的术语准确性：{prop.name}（范围：{prop.scope}）
    //    验证项：
    //    1. termEn 是否为该领域标准英文术语
    //    2. termCn 是否为该领域标准中文术语
    //    3. 是否存在其他常见叫法（全部列出）
    //    4. 命题范围是否与标准定义一致
    //    返回：{ termEn, termCn, isTermAccurate, mismatch, errorType }"
}

// ============================================================
// 通用规则
// ============================================================
// - 出题优先简答题，是否/选择也可以出
// - 出题语言与 frontmatter.language 一致
// - 评分依据：节点 summary + sampleQuestions 评分要点
// - 每次出题前检查 last_question，确保角度不同
//
// ── WIP 目录的定位（重要）──
// WIP 目录（*-wip/）是递归拆解的中间产物，是重要参考，但**不是输出文档，也不是记录知识的媒介**。
// 一旦拆解工作完成（writeOutput 生成最终文档后），WIP 目录即冻结：
//   - 后续工作（即使是对同一主题的重新拆解）不再更新 WIP 中的文件
//   - WIP 可被引用、参考，但不作为活跃文档维护
//   - 如果需要重新拆解，启动新的递归流程生成新的 WIP 目录
//   - 最终产物（writeOutput 的输出文件 + progress CSV）才是正式文档，后续迭代更新最终产物
```
