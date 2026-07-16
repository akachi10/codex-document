---
name: tdd-amendment-bug-fix
description: Amendment to test-driven-development skill. Adds bug-fix yellow-test pattern and DB-state assertion requirement. Apply ALONGSIDE the base TDD skill, never instead of.
---

# TDD Amendment: Bug Fix & DB Assertion

This skill **adds to** `~/.codex/skills/test-driven-development/SKILL.md`. The base skill is downloaded / version-controlled and may be overwritten — this amendment is the project-specific patch.

## Always apply both

Whenever the base TDD skill is referenced, this amendment is referenced too.

## Amendment 1 — Yellow test (bug-fix bisection)

In white-box bug fixes you know the exact wrong behavior. Write **two** test sets:

| Set | Purpose | RED phase | After implementation |
|-----|---------|-----------|----------------------|
| **Yellow** | Reproduces current BUG behavior | red (mocks not ready) | turns GREEN in stage B → proves BUG exists → **must be reversed or deleted in stage D** (assertion now says "BUG behavior no longer happens") |
| **Green** | Asserts fixed behavior | red | turns GREEN only after implementation in stage C |

**Four phases** (extends base RED-GREEN-REFACTOR):

1. **A — RED**: Write both yellow + green tests. All red (compile / mock missing).
2. **B — YELLOW+GREEN**: Wire mocks. Yellow tests pass (confirms BUG exists in current code). Green tests still red (waiting for fix). **Report yellow test output to user as proof.**
3. **C — Implement**: Fix production code.
4. **D — ALL GREEN**: Green tests pass. Yellow tests now reversed (assert BUG no longer happens) and pass.

Yellow tests are **evidence**, not permanent regressions. After D they describe what the code no longer does.

## Amendment 2 — DB-state assertion for integration tests

Integration tests must assert **actual DB state**, not mock invocations.

After every action under test, query the DB (psql / JdbcTemplate / repository.findById) and assert:

- **Row count delta** (X rows added/removed/unchanged)
- **Field values** of mutated rows (state machine, FK, audit fields)
- **Untouched rows** stayed unchanged (no collateral mutation)

Mock-invocation assertions are allowed in pure unit tests; integration tests must back them with DB facts.

## Reporting requirements

In every agent report:
- Quote Phase B yellow test output verbatim
- For integration tests, paste psql before/after snapshots

## Iron law still applies

The base skill's iron law — no production code without a failing test first — overrides everything here. This amendment only adds structure to **what** the failing tests look like.