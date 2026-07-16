# codex-document

`~/.codex` 配置本体（Codex 行为契约、角色、skills 与 hook）的版本控制仓库。

## 目录

```text
codex/
├── AGENTS.md      # Codex 全局行为契约
├── config.toml    # Codex 运行配置；不含认证凭据
├── hooks.json     # 全局 hook 配置
├── agents/        # 角色定义与对应 Codex agent 配置
└── skills/        # 用户 skills 与 Codex 系统托管 skills
```

模板仓库 `claude-document` 实际使用 `claude/` 镜像目录，因此本仓库使用对称的 `codex/`，而不是 `.codex/`。

## reports/ 目录说明

`reports/` 是覆盖 S0–S6 的施工报告体系，承载盘点映射、移植施工、升审裁决与反向终审，是本仓库的外置工程记忆。

## 纳入范围

只纳入配置本体：`AGENTS.md`、`config.toml`、`hooks.json`、`agents/`、`skills/`。

`config.toml` 只有在提交前通过 `token|key|secret|password|bearer` 关键词扫描与全量秘密审计后才纳入。它可能包含本机路径、信任级别、插件开关与校验 hash，但不得包含认证凭据。

以下永不入库：`auth.json`、`history.jsonl`、`sessions/`、`session_index*`、数据库与状态文件、模型缓存、插件缓存、shell snapshots、备份、临时目录、运行时目录、进程状态、goals/memories 数据、`*.bak*`、`.DS_Store`。`skills/` 内可再生的 `node_modules/`、`__pycache__/` 与 `*.pyc`/`*.pyo` 也排除；仓库保存 skill 源码和资源，不保存依赖缓存。

`gstack` 的四个安全扫描测试文件含 synthetic private-key header，既不是运行所需配置，又会制造秘密扫描噪声，因此按精确路径排除：`test/brain-sync.test.ts`、`test/gstack-decision-bins.test.ts`、`test/gstack-decision.test.ts`、`test/redact-engine.test.ts`。其余 skill 说明、脚本与资源不受影响。

## 同步方式

本仓库是 `~/.codex` 配置本体的镜像快照，权威始终是本机 `~/.codex`。下面的命令只同步白名单入口；完整排除项用于保护隐私、运行时数据与可再生缓存。

```bash
# 本机 → 仓库（每次大修后）
cd ~/IdeaProjects/codex-document

rsync -a --delete \
  --exclude='auth.json' --exclude='history.jsonl' --exclude='sessions/' --exclude='session_index*' \
  --exclude='*.sqlite' --exclude='*.sqlite-*' --exclude='models_cache*' --exclude='state_*' \
  --exclude='cache/' --exclude='plugins/' --exclude='shell_snapshots/' --exclude='backups/' \
  --exclude='skills-backup-*.tar.gz' --exclude='.tmp/' --exclude='tmp/' --exclude='runtime/' \
  --exclude='process_manager/' --exclude='goals/' --exclude='memories/' \
  --exclude='node_modules/' --exclude='__pycache__/' --exclude='*.pyc' --exclude='*.pyo' \
  --exclude='gstack/test/brain-sync.test.ts' --exclude='gstack/test/gstack-decision-bins.test.ts' \
  --exclude='gstack/test/gstack-decision.test.ts' --exclude='gstack/test/redact-engine.test.ts' \
  --exclude='*.bak*' --exclude='.DS_Store' \
  ~/.codex/agents/ codex/agents/

rsync -a --delete \
  --exclude='auth.json' --exclude='history.jsonl' --exclude='sessions/' --exclude='session_index*' \
  --exclude='*.sqlite' --exclude='*.sqlite-*' --exclude='models_cache*' --exclude='state_*' \
  --exclude='cache/' --exclude='plugins/' --exclude='shell_snapshots/' --exclude='backups/' \
  --exclude='skills-backup-*.tar.gz' --exclude='.tmp/' --exclude='tmp/' --exclude='runtime/' \
  --exclude='process_manager/' --exclude='goals/' --exclude='memories/' \
  --exclude='node_modules/' --exclude='__pycache__/' --exclude='*.pyc' --exclude='*.pyo' \
  --exclude='gstack/test/brain-sync.test.ts' --exclude='gstack/test/gstack-decision-bins.test.ts' \
  --exclude='gstack/test/gstack-decision.test.ts' --exclude='gstack/test/redact-engine.test.ts' \
  --exclude='*.bak*' --exclude='.DS_Store' \
  ~/.codex/skills/ codex/skills/

rsync -a --exclude='*.bak*' --exclude='.DS_Store' \
  ~/.codex/AGENTS.md ~/.codex/hooks.json ~/.codex/config.toml codex/

git add -A && git commit && git push origin main

# 仓库 → 新机器（恢复；不使用 --delete，避免移除本机运行时数据）
rsync -a \
  --exclude='auth.json' --exclude='history.jsonl' --exclude='sessions/' --exclude='session_index*' \
  --exclude='*.sqlite' --exclude='*.sqlite-*' --exclude='models_cache*' --exclude='state_*' \
  --exclude='cache/' --exclude='plugins/' --exclude='shell_snapshots/' --exclude='backups/' \
  --exclude='skills-backup-*.tar.gz' --exclude='.tmp/' --exclude='tmp/' --exclude='runtime/' \
  --exclude='process_manager/' --exclude='goals/' --exclude='memories/' \
  --exclude='node_modules/' --exclude='__pycache__/' --exclude='*.pyc' --exclude='*.pyo' \
  --exclude='gstack/test/brain-sync.test.ts' --exclude='gstack/test/gstack-decision-bins.test.ts' \
  --exclude='gstack/test/gstack-decision.test.ts' --exclude='gstack/test/redact-engine.test.ts' \
  --exclude='*.bak*' --exclude='.DS_Store' \
  codex/agents/ ~/.codex/agents/

rsync -a \
  --exclude='auth.json' --exclude='history.jsonl' --exclude='sessions/' --exclude='session_index*' \
  --exclude='*.sqlite' --exclude='*.sqlite-*' --exclude='models_cache*' --exclude='state_*' \
  --exclude='cache/' --exclude='plugins/' --exclude='shell_snapshots/' --exclude='backups/' \
  --exclude='skills-backup-*.tar.gz' --exclude='.tmp/' --exclude='tmp/' --exclude='runtime/' \
  --exclude='process_manager/' --exclude='goals/' --exclude='memories/' \
  --exclude='node_modules/' --exclude='__pycache__/' --exclude='*.pyc' --exclude='*.pyo' \
  --exclude='gstack/test/brain-sync.test.ts' --exclude='gstack/test/gstack-decision-bins.test.ts' \
  --exclude='gstack/test/gstack-decision.test.ts' --exclude='gstack/test/redact-engine.test.ts' \
  --exclude='*.bak*' --exclude='.DS_Store' \
  codex/skills/ ~/.codex/skills/

rsync -a --exclude='*.bak*' --exclude='.DS_Store' \
  codex/AGENTS.md codex/hooks.json codex/config.toml ~/.codex/
```
