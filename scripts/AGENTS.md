# Scripts Architecture Notes

## Mission
The `/scripts` workspace is evolving into an operator-focused CLI surface for Anveio. Every task in this directory should feel safe, discoverable, and pleasant to run at 03:00 when an alert fires. The goals:

- **Single entry point**: treat `/scripts` as a cohesive toolbox that can be launched via `node scripts/index.ts` or individual commands.
- **Interactive by default**: when arguments are omitted, the script should prompt with clear labels, masking secrets and validating user input.
- **Composable**: reusable utilities (prompt helpers, AWS tooling, Convex invocations) live under `scripts/lib` so subcommands stay terse.
- **TypeScript everywhere**: we rely on Node 24’s native type stripping, so no build step is needed—just run the `.ts` files directly.
- **Safety first**: every command should explain what it is about to do, summarise side effects, and ask for confirmation if the action is destructive.

## Guiding Principles

1. **Zero-config execution**  
   Running `node scripts/<task>.ts` should “just work” with the repo’s `npm install`. Prefer Batteries-included libraries (e.g. `@inquirer/prompts`) over rolling our own TTY UX.

2. **Self-documenting commands**  
   Each script must implement `--help` output that describes required/optional arguments, examples, and post-run expectations. Think `aws cli` or `git` levels of clarity.

3. **Interactive + non-interactive parity**  
   Provide flags for automation (CI, cron) but fall back to prompts when values are missing. Explicit beats implicit—never silently pick defaults that could surprise an operator.

4. **Shared UX affordances**  
   - Centralise logging helpers (info/warn/error) for consistent styling.
   - Funnel all Convex calls through a single helper that wraps `npx convex run`, captures exit codes, and surfaces friendly errors.
   - Wrap AWS CLI interactions with guardrails (pre-check command availability, echo next steps).

5. **Fail loudly, fail early**  
   Validate inputs up front. If preconditions are missing (e.g. required env vars/flags), exit with a clear message before touching external systems.

## CLI Entry Point

- Run `node scripts/index.ts` (or `npm run ops`) to browse tasks interactively. Use `--help` to list available subcommands without the prompt.
- Operators can still launch one-off tools directly, e.g.:

  ```bash
  node scripts/seed-admin.ts --help
  npm run seed:admin -- --email ops@anveio.com --password "••••"
  ```
- When adding a new tool, wire it into the dispatcher *and* keep its standalone invocation working—power users will script against the file paths.

## Implementation Checklist for New Scripts

1. Create `scripts/<task>.ts` with shebang `#!/usr/bin/env node`.
2. Use shared prompt helpers from `scripts/lib` where available; otherwise add the helper first before using it.
3. Parse CLI flags via the common utilities, prompt for missing values, and echo the final payload before executing remote commands.
4. Exit with non-zero codes on failure; include actionable remediation tips in error messages.
5. Document the command’s intent, required permissions, and rollback guidance in its `--help` output. If external systems need updating, list them explicitly.

Following this playbook keeps `/scripts` cohesive, lowers on-call toil, and gives us room to grow into a full-fledged operational CLI without rewriting each tool.
