/**
 * PreToolUse guard for the orchestration subagents (`.claude/agents/*.md`).
 *
 * Each agent passes a mode; the hook blocks (exit 2, reason on stderr — Claude Code feeds it back
 * to the agent) anything outside that agent's lane, so parallel agents cannot overlap:
 *
 *   work   - may only write handoff files under `.claude/work/`            (planner, reviewer)
 *   tests  - `.claude/work/` plus test files (*.test.ts(x), *.spec.ts(x))  (test-writer)
 *   web    - everything in the repository                                  (web-builder)
 *   bash   - blocks git commands that rewrite history or discard changes   (all agents)
 */
import path from "node:path";

const WORK = /^\.claude\/work\//;
const TESTS = /(\.spec\.tsx?|\.test\.tsx?)$|\/__tests__\//;
const DESTRUCTIVE_GIT =
  /\bgit\s+(commit|push|reset|checkout|switch|restore|stash|clean|rebase|merge|cherry-pick|revert|branch\s+-[dD]|tag)\b/;

const mode = process.argv[2];
let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw || "{}");
const toolInput = input.tool_input ?? {};

function block(reason) {
  process.stderr.write(`[guard:${mode}] ${reason}\n`);
  process.exit(2);
}

if (mode === "bash") {
  const command = String(toolInput.command ?? "");
  if (DESTRUCTIVE_GIT.test(command)) {
    block(
      "Subagents must not commit, push, or move/discard working-tree changes. Report back to the orchestrator instead.",
    );
  }
  process.exit(0);
}

const target = toolInput.file_path ?? toolInput.notebook_path;
if (!target) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const rel = path
  .relative(root, path.resolve(input.cwd || root, target))
  .split(path.sep)
  .join("/");

if (rel.startsWith("..")) block(`${target} is outside the repository.`);

const allowed = {
  work: () => WORK.test(rel),
  tests: () => WORK.test(rel) || TESTS.test(rel),
  web: () => true,
}[mode];

if (!allowed) block(`Unknown guard mode "${mode}".`);
if (!allowed()) {
  block(
    `${rel} is outside this agent's lane. Note it in your report so the orchestrator can route it to the owning agent.`,
  );
}
