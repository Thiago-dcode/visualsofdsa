# Agent instructions

This repo ships project skills in `.agents/skills/<name>/SKILL.md`. They hold the architecture boundaries, conventions and step-by-step recipes for this codebase. **Read the relevant skills before making any change**, including changes requested from issues or chat. Do not start editing until you have.

## Always read first

- `.agents/skills/tech-stack/SKILL.md`
- `.agents/skills/architecture/SKILL.md`

## Then read the skills for the area you touch

| Area                                                                                         | Skills                                                                                                         |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Routes, components, entities (components and hooks), context, styling, `src/app/globals.css` | `frontend` (also `accessibility` for interactive UI, `marketing-seo-ux` for public pages and metadata/sitemap) |
| `src/entities/**/classes`, `src/lib`, `prisma/`                                              | `architecture` (and `tech-stack` for the test runner and DB client rules)                                      |
| Commit / push (only when explicitly asked)                                                   | `deployment`                                                                                                   |

## Multi-agent pipeline (Claude Code)

**The user never invokes the agents. Choosing the tier is your job, on every implementation request.** This is a standing instruction to use the subagents in `.claude/agents/` whenever the tier calls for them. Before you start editing, say in one line which tier you picked and why.

| Tier              | When (any one trigger is enough for a higher tier)                                                                                                                                                          | What you do                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Direct**        | UI/styling tweak, copy string, single component, config value, typo, an obvious one-file bug, questions and research                                                                                        | Implement it yourself and run `pnpm biome`. No agents.                                                                                                                     |
| **Reviewed**      | Logic change in one entity or a few files, a bug fix that changes behaviour, a small hook change                                                                                                            | Implement it yourself, write a short `.claude/work/<slug>/plan.md` (goal + acceptance criteria + files), then spawn a fresh `reviewer` and fix its BLOCKER/MAJOR findings. |
| **Full pipeline** | New algorithm or data-structure entity · shared hook or context change · route, URL, sitemap or SEO-metadata change · new visualization control that touches the animation loop · roughly 6+ files of logic | Follow `.agents/skills/orchestrate/SKILL.md`: `planner` → `web-builder` → `test-writer` → `reviewer`, with a bounded fix loop.                                             |

Examples: "change the button colour" is **Direct**. "Fix the speed label rounding" is **Direct**. "Make the step size configurable per visualization" is **Reviewed**. "Add a Heap sort visualization with its tests and sitemap entry" is **Full pipeline**. If you're unsure between two tiers, pick the higher one. If the work grows past its tier partway through, move it up and say so.

Agents hand off through `.claude/work/<slug>/` files, and `.claude/hooks/guard.mjs` keeps each agent in its own lane.

## Workflow

1. Identify the area(s) the task touches and read the skills above.
2. Implement following those skills; respect the layer boundaries in `architecture`.
3. Run the gates for the change: `pnpm biome`, `pnpm exec vitest run <pattern>`, and `pnpm build` when routes or server code change.
4. When you open a PR or write a commit message, list which skills you followed.
