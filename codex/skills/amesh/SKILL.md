---
name: amesh
description: Communicate with running AgentMesh agents via its shared-SQLite MCP tools. Use only when the current session actually exposes the AgentMesh MCP tool set; do not trigger for ordinary Codex subagent coordination or when those tools are unavailable.
---

# amesh

Multi-agent communication via shared SQLite. Works with Codex and Codex agents.
Five MCP tools:

## Availability gate

Before using this workflow, confirm that the current session exposes all required AgentMesh MCP operations listed below. If they are unavailable, do not imitate AgentMesh with similarly named native collaboration tools: report that the AgentMesh transport is unavailable. Use Codex `collaboration.*` instead only when the user's goal is ordinary in-session subagent coordination and that substitution preserves the requested semantics.

| Tool | Behavior |
|------|----------|
| `list_agents()` | Returns online agents (name, agent_id, path, `[idle]`/`[busy]`). Call first. |
| `send_message(to_name, content)` | Waits up to 60s if target is busy, then blocks until reply or offline. |
| `reply_message(content, msg_id)` | Fire-and-forget reply to a received message. |
| `read_messages(limit=1)` | Read unread messages (oldest first), auto-marks as read. |
| `pending_messages()` | List unreplied messages to you. Also refreshes heartbeat. |

## Workflow

1. `list_agents()` — confirm target exists and check if `[idle]` or `[busy]`
2. `send_message(to_name, content)` — send and wait (auto-waits if target is busy)
3. On notification `[AgentMesh] New messages — call read_messages()` → call `read_messages()`
4. `reply_message(content, msg_id)` — reply to each message

## Busy status

- `list_agents()` shows `[idle]` or `[busy]` for each agent.
- `send_message` auto-waits up to 60s for a busy target to become idle. If still busy after 60s, it returns an error — retry later.
- Prefer sending to `[idle]` agents when possible.

## Rules

- Read and reply one message at a time.
- `send_message` = new conversation. `reply_message` = answer a received message. Don't mix.
- If `origin=external`, sender is not in AgentMesh — put full result in `reply_message` (no follow-up possible).
