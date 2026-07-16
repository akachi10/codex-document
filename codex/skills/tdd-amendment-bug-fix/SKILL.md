---
name: tdd-amendment-bug-fix
description: Amendment to test-driven-development skill. Adds bug-fix yellow-test pattern and DB-state assertion requirement. Apply ALONGSIDE the base TDD skill, never instead of.
---

# TDD Amendment: Bug Fix & DB Assertion

This skill **adds to** `~/.codex/skills/test-driven-development/SKILL.md`. The base skill is downloaded / version-controlled and may be overwritten — this amendment is the project-specific patch.

## Always apply both

Whenever the base TDD skill is referenced, this amendment is referenced too.

## Amendment 1 — Yellow test (bug reproduction probe)

In white-box bug fixes you know the exact wrong behavior. Write **two** tests. **Both are written once and never edited afterwards** — phases only observe them.

| Test | Assertion (fixed at birth, never rewritten) | Before fix | After fix |
|------|---------------------------------------------|-----------|-----------|
| **Yellow** | The BUG behavior does **not** happen（BUG 再现探测：结果 `true`=继续复现，`false`=不再复现） | **FAILS**（true/复现中）— failure output shows the actual buggy value | **PASSES**（false/不再复现 = BUG 修复） |
| **Red** | The **correct** behavior happens（调用功能，断言正确行为） | **FAILS**（功能未实现/未修复） | **PASSES**（转绿 = 完成） |

**Four phases** (extends base RED-GREEN-REFACTOR):

1. **A — Write both tests**: yellow asserts the BUG behavior is absent; red asserts the correct behavior. Wire minimal stubs **in this phase** — the baseline failures must be **assertion failures**, never compile errors or missing mocks (base TDD rule).
2. **B — Baseline, double red**: Run both. Yellow fails, its output showing the buggy behavior actually occurring — **quote this output verbatim to the user as reproduction proof**. Red fails on the missing correct behavior.
3. **C — Fix production code**: Tests are frozen — not a single character of either test may change.
4. **D — Double green**: Red passes (correct behavior present) **and** yellow passes (BUG behavior gone). **Both tests stay in the suite permanently** — yellow guards against the wrong behavior returning, red guards the correct behavior. They are complementary, not redundant: a wrong-direction "fix" turns one green but not the other.

If in D only red turns green（行为出现了但错误行为也还在）or only yellow turns green（错误行为消失但没修成正确行为）→ keep fixing production code; never touch the tests.

### Second trigger — post-implementation adversarial probe（完工后主动探雷）

Yellow tests are not only for known bugs. After implementation is complete, hypothesize what bugs are likely（边界、空值、并发、状态机漏态、字符串包含坑……），**deliberately construct the exact conditions that would hit the hypothesized bug**, and write a yellow test asserting that bug behavior does not happen.

- Probe **passes**（false = 不复现）: hypothesis cleared — keep the test in the suite as a permanent guard against that failure mode.
- Probe **FAILS**（true = 复现）: a real bug just got caught — enter the four-phase flow above, with this yellow test already serving as the phase-B reproduction evidence（补写 red test 断言正确行为 → fix → double green）.

Writing probes after code does not violate base TDD's iron law — the production code being probed was itself developed test-first; probes are **additional adversarial coverage**, never a substitute for test-first development.

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
