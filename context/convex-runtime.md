# Convex Runtime Notes

Convex functions run in a special JavaScript runtime with semantics that differ slightly from Node.js.
Understanding these differences avoids surprises when porting browser/Node code into Convex functions.

## Runtime Environment
- **Global runtime**: Convex executes functions in a V8-based sandbox. Node-specific globals (e.g., `process`, `Buffer`) are unavailable unless documented.
- **Web Crypto API**: The runtime offers the standard `crypto` Web API (see [MDN: Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)).
  - Use `crypto.randomUUID()` or `crypto.getRandomValues()` for random data.
  - Do **not** import `node:crypto`; Node-specific modules are unsupported.
- **Timers**: `setTimeout`, `setInterval`, etc., are unavailable. Convex functions must complete quickly and should not block.
- **File system & network**: Access to the file system or arbitrary network calls is prohibited inside mutations/queries. Use actions for network requests if required.
- **Global object**: `globalThis` is available; prefer it over Node’s `global`.
- **Import resolution**: Only ESM-style imports using supported packages are allowed. Avoid Node built-ins unless documented by Convex.

## Function Types
- **Queries**: Pure reads; run on Convex infrastructure; automatically cached and parallelizable.
- **Mutations**: Write transactions; run sequentially per table to ensure serializability.
- **Actions**: Opt-in to a Node.js runtime; useful for integrating with external APIs or performing CPU-heavy work. Actions can call queries/mutations via `ctx.runQuery`/`ctx.runMutation`.

## Best Practices
- Prefer pure business logic in helpers that accept injected dependencies so the same code can run inside Convex and Node.
- Validate all inputs with `convex/values` validators; avoid runtime-only type guards unless necessary.
- Handle timestamps via `Date.now()` to respect Convex’s runtime; avoid `process.hrtime()`.
- When you need randomness or IDs, prefer Convex utilities or Web Crypto (`crypto.randomUUID()`).
- Keep functions fast; heavy computation should be offloaded to actions or external workers.

## Useful Links
- Convex official runtime docs: https://docs.convex.dev/functions/runtimes
- Validator reference: https://docs.convex.dev/using/validating-data
- Actions (Node runtime) docs: https://docs.convex.dev/functions/actions

