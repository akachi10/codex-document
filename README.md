# codex-document

`~/.codex` 配置本体（Codex 行为契约、角色、skills 与 hook）的版本控制仓库。

本仓库直接以 `~/.codex` 为 Git 工作树，与 `~/.claude` 的管理方式一致；不再维护 `~/IdeaProjects/codex-document/codex/` 镜像，也不需要 rsync。

## 目录

```text
~/.codex/
├── .git/          # 本仓库 Git 元数据
├── .gitignore     # 白名单跟踪静态配置，排除运行时状态
├── AGENTS.md      # Codex 全局行为契约
├── config.toml    # Codex 运行配置；不含认证凭据
├── hooks.json     # 全局 hook 配置
├── agents/        # 角色定义与对应 Codex agent 配置
├── skills/        # 用户 skills 与 Codex 系统托管 skills
└── reports/       # S0–S6 施工与审查报告
```

## 纳入范围

Git 只纳入：`AGENTS.md`、`config.toml`、`hooks.json`、`agents/`、`skills/`、`reports/`、`README.md` 与 `.gitignore`。

`.gitignore` 默认排除 `~/.codex` 下的认证凭据、会话历史、数据库、缓存、插件、临时目录、进程状态、备份与其他运行时数据。`skills/` 内的 `node_modules/`、`__pycache__/`、`*.pyc`、`*.pyo` 同样不入库。

`config.toml` 提交前必须通过 `token|key|secret|password|bearer` 关键词扫描与全量秘密审计。它可以包含本机路径、信任级别、插件开关与校验 hash，但不得包含认证凭据。

`gstack` 的四个安全扫描测试文件含 synthetic private-key header，既不是运行所需配置，又会制造秘密扫描噪声，因此按精确路径排除：`test/brain-sync.test.ts`、`test/gstack-decision-bins.test.ts`、`test/gstack-decision.test.ts`、`test/redact-engine.test.ts`。

## 日常提交

```bash
cd ~/.codex
git status
gitleaks dir . --redact --no-banner
git add -A
gitleaks git --staged --redact --no-banner
git commit
git push origin main
```

## 新机器恢复

在 Codex 首次运行前克隆：

```bash
git clone https://github.com/akachi10/codex-document.git ~/.codex
```

之后 Codex 产生的运行时文件会与仓库共存，但被 `.gitignore` 排除；静态配置可以直接在 `~/.codex` 修改、提交和推送。
