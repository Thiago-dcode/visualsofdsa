---

name: deployment
description: >-
Commit local changes and optionally push to origin, after the pre-push gate passes.
Use ONLY when the user explicitly asks to commit or push. Do not use during feature
work, code review, or implementation.
---

# Deployment (commit → gate → push)

Explicit-request skill. Completing a coding task is **not** permission to commit or push.

This repo has no CI workflows in `.github/`. The gate runs locally, so it must pass before anything goes to origin (`https://github.com/Thiago-dcode/visualsofdsa.git`).

## When this skill applies

Run it only if the user clearly asked, for example: "commit", "commit this", "push", "push to origin".

| User said             | Do                                                                          |
| --------------------- | --------------------------------------------------------------------------- |
| commit (no push)      | Commit only. Stop.                                                          |
| push / push to origin | Commit if needed, then **pre-push gate**, then push the **current** branch. |

If the request is ambiguous ("ship it", "deploy this") and they did not name **commit** or **push**, ask which action they want. Do not guess.

## Hard rules

- Never commit unless the user asked to commit or to push.
- Never `--force` / `--force-with-lease` to `main`. Warn if they ask.
- Never `--no-verify`, `--no-gpg-sign`, or `git config`.
- Never interactive git (`-i`).
- Never commit `.env`, `.env.*`, credentials, or secret files. Warn if they ask. Note that `.env.supabase.bak` exists at the root and is not tracked: leave it out.
- Do not amend unless the user asked, or HEAD was created by you in this conversation, the commit succeeded, and it has **not** been pushed. If a hook **rejected** the commit, fix and make a **new** commit.
- If already pushed, never amend unless the user explicitly asked (that requires a force-push; refuse for `main`).

## 1. Inspect (always, in parallel)

```bash
git status
git diff
git log -12 --format="%s"
git branch --show-current
git status -sb
```

The working tree may hold changes from other work. **Only commit the files that belong to the task you are closing.** Ask if it is unclear which those are.

Read the diff. Draft a message that matches recent log style and explains **why**, in 1–2 sentences.

## 2. Commit (when asked)

Stage only the relevant files:

```bash
git add -- path1 path2
git commit -m "$(cat <<'EOF'
feat(scope): short why-focused summary

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
EOF
)"
git status
```

End the message with the attribution lines from the session's system reminder, if one is present. Use the current model's name there.

If the user only asked to commit, **stop here** and report the hash + message.

## 3. Pre-push gate (mandatory before every origin push)

Never push to origin unless this passes. Do not skip for "small" changes.

```bash
pnpm biome
pnpm exec vitest run
pnpm build
```

- `pnpm biome` is lint + format check. Fix with `pnpm biome:fix` only when the fix is mechanical and you have reviewed it.
- `pnpm exec vitest run` is the one-shot test run. Plain `pnpm test` stays in watch mode.
- `pnpm build` runs `prisma contract emit` and `next build`. It needs the environment from `.env`. If it fails only because the database is unreachable, say so and report it. Do not hide it.

If any step fails:

1. Fix the code.
2. Re-run the gate until it passes.
3. Commit the fix (as part of the push request).
4. Only then push.

Do not push a known-red tree, and do not weaken tests or lint rules to get green.

## 4. Push

Current branch unless the user named another one.

```bash
git push -u origin HEAD
```

If the current branch is `main` and the user did not clearly ask to push to `main`, stop and ask first.

## Done

Tell the user, in plain language:

- Commit hash and message (if you committed)
- Whether you pushed, and to which branch
- Gate results (`biome`, `vitest`, `build`)
- If anything failed: the step, the cause, and what you changed (or why you stopped)
