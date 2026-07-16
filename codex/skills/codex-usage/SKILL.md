---
name: codex-usage
description: Query Codex ChatGPT-plan usage and reset windows. Use whenever the user asks how much Codex usage is left, 5-hour usage, weekly usage, quota, rate limit, reset time, or whether the current Codex conversation is consuming plan allowance. This is for Codex subscription usage, not OpenAI API billing usage.
---

# Codex Usage

Use this skill when the user asks about Codex plan usage, especially:

- "还剩多少"
- "5小时用量"
- "weekly limit"
- "Codex 额度"
- "reset 还有多久"
- "API dashboard 为什么是 0"

## What This Checks

This checks Codex subscription usage from the ChatGPT/Codex backend:

- `Session (5h)` — current 5-hour Codex usage window
- `Week (7d)` — weekly Codex usage window
- plan name, such as `plus`
- reset times

This is different from OpenAI API usage at `platform.openai.com/usage`.
The tool reports aggregate plan windows; it cannot attribute usage to a single
conversation.

## Preferred Command

Run:

```bash
~/.codex/runtime/codex-usage-venv/bin/codex-cli-usage
```

This third-party tool reads Codex OAuth credentials from:

```text
~/.codex/auth.json
```

Do not print or expose `~/.codex/auth.json` contents. Only report the usage summary.

## If The Command Is Missing

If `~/.codex/runtime/codex-usage-venv/bin/codex-cli-usage` does not exist, recreate the stable environment from the official PyPI index using the pinned package version:

```bash
mkdir -p ~/.codex/runtime
/opt/homebrew/bin/python3.12 -m venv ~/.codex/runtime/codex-usage-venv
~/.codex/runtime/codex-usage-venv/bin/python -m pip install --index-url https://pypi.org/simple codex-cli-usage==0.1.7
```

The package requires Python 3.12+.

## Network Notes

The command needs network access. If it fails with DNS, connection, or sandbox-related network errors, rerun it with escalated network permission.

## Completion

The query succeeds only when the command exits with status zero and returns a
subscription usage summary. If authentication or network access fails, or
required fields are missing, report the failure and missing fields; do not guess
values or substitute data from the API dashboard.

## Response Format

Report the result concisely:

```text
Plan: plus
Session (5h): 48% used, resets in 3h27m
Week (7d): 8% used, resets in 166h27m
```

If the tool prints percentages without saying used vs left, preserve the tool wording and explain that it is the tool's usage percentage output.
