---

name: orchestrate
description: Multi-agent pipeline for visualsofdsa (planner → web-builder → test-writer → reviewer, with a fix loop). Use proactively, without being asked, whenever an implementation request hits a Full-pipeline trigger in AGENTS.md (new entity or visualization, shared hook or context change, routing or SEO/URL change, ~6+ files of logic). Not for UI tweaks, copy, or one-file fixes.
argument-hint: <what to build or fix>
---

# Orchestrate

You are the **orchestrator**. You run the pipeline, pass context between agents through files, and report to the user. **Don't edit source code yourself.** That keeps your context small and keeps the review independent. Subagents are defined in `.claude/agents/`.

## Shared state: `.claude/work/<slug>/`

Agents never see each other's conversations. Everything they share is on disk:

| File           | Written by  | Read by                |
| -------------- | ----------- | ---------------------- |
| `plan.md`      | planner     | everyone               |
| `build-web.md` | web-builder | test-writer, reviewer  |
| `tests.md`     | test-writer | reviewer               |
| `review.md`    | reviewer    | orchestrator → builder |

Pick a short kebab-case `<slug>` for the task. Each agent prompt only needs the slug, the file paths to read, and anything new since the plan. Don't paste the plan into prompts.

## Pipeline

**0. Confirm the tier.** The tier table in `AGENTS.md` decides. _Direct_ and _Reviewed_ tasks don't use this pipeline. If the task turns out to be _Reviewed_, stop here and follow that row instead. The user doesn't invoke agents; you decide, and you tell them the tier in one line.

**1. Plan.** Spawn `planner` with the request, the slug, and the **Constraints** it can't discover itself: the visualization conventions the user cares about (pause/step behaviour, mute, reduced motion), any URL or SEO invariants, and anything the user said in chat. If it returns _Blocking questions_, ask the user (AskUserQuestion), append the answers to `plan.md`, and continue. For large or risky plans, show the user the AC list and work split and get a go-ahead before building.

**2. Build.** Spawn `web-builder` with: slug, "read `.claude/work/<slug>/plan.md`, implement your section". Keep the agent ID; you will resume it in step 5. If a builder reports a contract problem, fix `plan.md` (re-run the planner if it's substantial) before going on.

**3. Test.** Spawn `test-writer` with the slug. Skip it when the plan has no testable ACs (e.g. pure visual or copy changes). Pure logic in `src/entities/**/classes` almost always has testable ACs.

**4. Review.** Spawn `reviewer` with the slug and round number. Always do this, even for _small_ tasks. It is the reason the user doesn't have to review.

**5. Fix loop.** If the verdict is `CHANGES_REQUESTED`:

- Send each BLOCKER/MAJOR finding to its owner by **resuming that agent** (SendMessage to the stored agent ID), so it keeps its implementation context. Send only the findings, not the whole review.
- Findings owned by test-writer go back to test-writer the same way.
- Then spawn a **fresh** `reviewer` for round N+1 (fresh context means independent judgment). Tell it which findings to verify.
- Stop after **2 fix rounds**. If it still isn't approved, report the open findings to the user and stop. Don't loop forever.

**6. Report** to the user, briefly:

- what was built (from the plan's Goal), and the AC table from `review.md`
- files changed (from the build report)
- gates run by the reviewer and their result
- any MINOR findings left open, deviations, and manual checks the user should do (e.g. "open /algorithms/sorting/quicksort, press Play, then Pause at half speed")
- Don't commit. Committing follows the `deployment` skill, and only when the user asks.

## Rules

- One owner per file. Only `web-builder` writes source; `test-writer` writes test files; `planner` and `reviewer` write only under `.claude/work/`. `.claude/hooks/guard.mjs` enforces this.
- Subagents can't commit, push, stash, reset or check out; the guard blocks it.
- Read the agents' reports, not their diffs. Open source files only to settle a dispute between agents.
- Leave `.claude/work/<slug>/` in place after the task (it's gitignored). It is the audit trail and lets a later session resume.
