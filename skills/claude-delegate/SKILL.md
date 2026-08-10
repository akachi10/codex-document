---
name: claude-delegate
description: Delegate work from Codex to Claude Code workers. Use when the user asks Codex to call Claude, ask Claude for a second opinion, create or manage Claude team members, keep Claude agents/sessions around for a team, resume a previous Claude worker, or run a task with Claude Code tools instead of Codex.
---

# Claude Delegate

Use this skill to create and operate Claude Code workers from Codex.

The bundled runtime is `scripts/claude-companion.mjs`. The skill is the thin
instruction layer, and the companion script owns session/job state. It uses the
official `@anthropic-ai/claude-agent-sdk` backend by default and also provides a
caller-selected `claude` CLI backend through `--backend cli`; SDK failures do
not automatically retry through the CLI. State is stored in
`~/.codex/claude-delegate/`.

Background jobs persist task prompts and returned content in that state
directory. Do not put sensitive data in prompts.

## Permission Default

Claude's closest equivalent to Codex
`--dangerously-bypass-approvals-and-sandbox` is:

- Claude CLI: `--dangerously-skip-permissions`
- Claude Agent SDK: `permissionMode: "bypassPermissions"` with
  `allowDangerouslySkipPermissions: true`

This skill uses that no-approval mode by default for every `run`, `send`, and
background job. Do not add an extra permission prompt layer unless the user
explicitly asks for safer execution. To opt out for a specific turn, pass
`--permission-mode default` or `--permission-mode auto`.

Permission mode controls only Claude's internal approval flow; it does not
grant task scope. Global and project authorization rules, together with all
required destructive-operation confirmations, always take precedence.

## Core Commands

```bash
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs doctor
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs init <worker-name> --role "<role prompt>"
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs send <worker-name> "<task>"
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs send <worker-name> --backend cli "<task>"
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs send <worker-name> --background "<task>"
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs workers
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs status [job-id]
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs result <job-id>
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs cancel <job-id>
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs remove <worker-name>
```

## Worker Model

- `init` creates a named Claude team member. It does not spend tokens.
- The first `send` starts a Claude Code session with the role prompt and task.
- Later `send` calls resume the saved `session_id` through the selected backend:
  `@anthropic-ai/claude-agent-sdk` `query({ options: { resume } })` for SDK, or
  `claude -p --resume <session_id>` for CLI. The worker keeps its prior context
  without staying alive or spending tokens while idle.
- `--background` runs a turn in a detached process and returns a job id.
- `status`, `result`, and `cancel` manage background jobs.
- `--backend cli` selects exact CLI behavior for a turn.

This is a suspended worker model: it preserves context between turns but does
not provide an always-on listener. If always-on inbox behavior is required,
report that this skill does not provide it.

## Completion

A foreground call is complete only after it returns successfully. A background
dispatch is not complete when it returns a job id: wait for `status` to become
`completed`, retrieve the `result`, then review and verify it. `failed` and
`cancelled` jobs are not complete.

## Review / Seminar Mode

Use this mode when the user asks for a review board, seminar, council,
multi-agent discussion, hallucination audit, or adversarial review involving
Claude and Codex agents.

Do not run the seminar as independent agents writing static `.md` reports and
then stop. That is evidence collection, not a discussion. The default seminar
protocol is direct, multi-round review:

1. Chair creates named participants, for example `claude-a`, `claude-b`,
   `codex-a`, and `codex-b`.
2. Round 0: Chair sends the same factual brief to every participant. The brief
   may be stored on disk for evidence, but each participant must return a direct
   response to the chair.
3. Round 1: Each participant returns its independent findings directly.
4. Round 2: Chair sends all Round 1 findings back to every participant and asks
   for objections, corrections, and changed opinions.
5. Optional Round 3: Chair asks targeted follow-up questions where participants
   disagree.
6. Chair writes the final summary only after the multi-round exchange is done.

Use files only as durable evidence or final artifacts:

- `facts.md`: shared factual packet, if useful.
- `round1-*.json` or `round1-*.md`: transcript archive of direct returns.
- `round2-*.json` or `round2-*.md`: transcript archive of rebuttals.
- `chair-summary.md`: final chair decision.

The file archive must not replace the conversation. A participant report file is
valid only if it was produced from a direct participant return or transcript.

For hallucination audits, require each participant to classify findings as:

- `VERIFIED`
- `POSSIBLE_OVERCLAIM`
- `HALLUCINATION_OR_UNSUPPORTED`
- `ENVIRONMENT_NUANCE`

The chair must separate what was directly verified by files/commands from what
was inferred from agent output.

## One-Off Claude Calls

Use `run` when no persistent worker is needed:

```bash
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs run "Ask Claude to review this design."
node ~/.codex/skills/claude-delegate/scripts/claude-companion.mjs run --background "Investigate this bug with Claude."
```

## Options

Common options:

- `--cwd <path>`: run Claude in a specific workspace. Defaults to current dir.
- `--backend <sdk|cli>`: choose execution backend. Defaults to `sdk`.
- `--model <model>`: pass a Claude Code model alias or id.
- `--effort <low|medium|high|xhigh|max>`: pass effort to Claude Code.
- `--dangerously-skip-permissions`: enabled by default for noninteractive team
  workers, so Claude does not pause on permission prompts. In SDK mode this maps
  to `permissionMode: "bypassPermissions"` plus
  `allowDangerouslySkipPermissions: true`.
- `--permission-mode <mode>`: override the default. Use `default` or `auto` for
  safer runs when the user wants Claude to enforce permission checks.
- `--tools <tools>`: pass Claude Code built-in tools list.
- `--allowed-tools <tools>`: pass a whitelist to Claude Code.
- `--max-budget-usd <n>`: pass Claude Code's print-mode budget cap.
- `--timeout-ms <n>`: foreground turn timeout. Defaults to 20 minutes.
- `--json`: emit machine-readable JSON.

## Operating Rules

1. Check `which claude` if a command fails before retrying.
2. Run `doctor` when setting up or debugging the skill; it checks `claude`, SDK
   import, versions, and state path without sending a Claude request.
3. If SDK loading fails, install the runtime dependency once:
   `cd ~/.codex/skills/claude-delegate && npm install @anthropic-ai/claude-agent-sdk`.
4. Use named workers for team roles: `architect`, `reviewer`, `tester`, etc.
5. Avoid concurrent `send` calls to the same worker. Use one worker per active
   job, or wait for the previous job to complete.
6. Default to no-approval execution. For destructive or production-impacting
   tasks, override with `--permission-mode default` or `--permission-mode auto`,
   or ask the user before dispatching.
7. Treat Claude output as another agent's work: review and verify before acting
   on it.
8. Invocation is governed by the global `~/.codex/AGENTS.md` external-engine
   bridge boundary. Its only adjudicated exception is the pre-start Claude
   review defined in `~/.codex/agents/scrum-master.md`.
