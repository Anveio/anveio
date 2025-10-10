# Better Auth Integration Notes

Collected details on how Better Auth is wired into this project, current constraints, and opportunities for the upcoming CMS work.

## Core Concepts

- **Entry point**: `betterAuth(options)` returns an `auth` object that exposes handlers (`auth.handler`/`auth.api.*`) plus typed helpers (e.g., `auth.api.getSession`).
- **Adapters**: Better Auth expects a database adapter that implements CRUD for `user`, `account`, `session`, and `verification` models. We currently use the in-memory adapter (`better-auth/adapters/memory`) which stores data in plain arrays.
- **Hashing**: Passwords go through Better Auth’s `hashPassword` (scrypt-based). Verification is handled by `verifyPassword` internally.
- **Next.js bridge**: The `better-auth/next-js` integration provides `toNextJsHandler` for API routes and `nextCookies()` plugin to sync Set-Cookie headers with Next’s `cookies()` helper.
- **Client SDK**: `better-auth/react` exposes `createAuthClient`, which builds a fetch proxy for hitting Better Auth routes from client components. Includes session atom hooks.
- **Configuration validation**: Our `lib/env.ts` uses `zod` to make sure required env vars (`BETTER_AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) exist before auth initializes.
- **Session helpers**: `auth.api.getSession` returns `{ session, user }` or null; typing driven by Better Auth’s generated zod schemas.

## Current Setup in This Repo

- Auth logic lives in `lib/auth.ts`, written as a server-only module.
  - Seeds the configured admin into the in-memory adapter at startup (`seedAdminUser`).
  - Configures Better Auth with:
    - `baseURL` from `AUTH_BASE_URL` or derived from `VERCEL_URL`.
    - `secret` from `BETTER_AUTH_SECRET`.
    - `emailAndPassword.enabled = true` but `disableSignUp = true` to lock to the single admin user.
    - `rateLimit.enabled = false` for simplicity (no persistence backing yet).
    - `plugins: [nextCookies()]` for Next cookies.
  - Exports `auth` and a convenience `AdminSession` type alias.
- API route `app/api/auth/[...betterAuth]/route.ts` forwards to `toNextJsHandler(auth)`.
- Client:
  - `lib/auth-client.ts` builds a fetch proxy pointed at `/api/auth`.
  - `components/admin/admin-login-form.tsx` uses `authClient.signIn.email`.
  - `components/admin/sign-out-button.tsx` uses `authClient.signOut`.
- Guards:
  - `lib/admin-session.ts` wraps `auth.api.getSession` and exposes `requireAdminSession` for server routes/pages.

## Working with the Adapter

- In-memory adapter defined in `better-auth/dist/adapters/memory-adapter`.
  - Accepts a simple object map where each key is the model name and the value is an array.
  - Supports `create`, `findOne`, `findMany`, `update`, `delete`, `count`, etc.
  - Handles `transaction` by cloning the DB state and rolling back on error.
  - Respects `options.advanced.database.useNumberId`; we leave it false because we use UUIDs.
- Database schema expectations:
  - `user`: `id`, `email`, `name`, `emailVerified`, etc.
  - `account`: includes `password` for email/password accounts; `providerId` for social providers.
  - `session`: `token`, `userId`, `expiresAt` with cookie caching support.
  - `verification`: for email/password reset flows (unused currently).

## API Surface We Rely On

- `auth.api.signIn.email({ email, password, rememberMe })` – returns `{ data, error }`.
- `auth.api.signOut()` – clears cookies and session.
- `auth.api.getSession({ headers })` – reads the current session via cookies; optional query flags:
  - `disableCookieCache`
  - `disableRefresh`
- `auth.api.listSessions`, `auth.api.updateUser`, etc., are available but unused yet.
- All endpoints accept `asResponse`/`returnHeaders` flags for low-level control, courtesy of Better Auth’s `createAuthEndpoint` wrappers.

## Cookie + Session Behavior

- The Next.js plugin pipes Set-Cookie headers to the App Router’s `cookies()` storage when used inside request scope.
- `session.cookieCache.enabled` caches session info in a cookie to avoid DB hits on every request. We set `maxAge = 1 hour`.
- `requireAdminSession` uses the cached cookie when valid; otherwise, the adapter fetches the session.
- In production we set `useSecureCookies` to true.

## Environment & Deployment

- Required env vars (documented in `.env.example`, `README.md`, `AGENTS.md`):
  - `BETTER_AUTH_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - Optional: `ADMIN_NAME`, `AUTH_BASE_URL`
- Our build step fails early if these are absent, so CI/Vercel must provide them.
- Because we’re using the in-memory adapter, every cold boot re-seeds the admin user; session cookies remain valid across restarts if the secret stays constant.

## Limitations & Next Steps

- **Storage**: In-memory adapter is ephemeral. Once we introduce Convex (or another DB) we need to swap to a persistent adapter. Better Auth ships adapters for popular DBs and a factory system for custom ones.
- **Single user**: `disableSignUp` prevents additional accounts; future multi-user support would require rethinking the seeding logic.
- **Password resets & email verification**: disabled right now. Enabling them means providing email delivery hooks (`sendResetPassword`, `sendVerificationEmail` events).
- **Rate limiting**: off because the adapter doesn’t persist state. Should enable after moving to durable storage to prevent brute-force attempts.
- **Client session hook**: `authClient` exposes a `useSession` hook via Nanostores; we can integrate it when we build the admin composer UI.
- **Testing**: `better-auth` includes memory-based test utilities (`getTestInstanceMemory`) we could harness once we add unit tests around auth flows.

## Useful Imports / Paths Recap

- `better-auth`: core runtime, `betterAuth` factory.
- `better-auth/next-js`: `toNextJsHandler`, `nextCookies`.
- `better-auth/adapters/memory`: in-memory adapter factory.
- `better-auth/crypto`: `hashPassword`, `verifyPassword`.
- `better-auth/react`: client fetch proxy + hooks.
- `@better-auth/core/db`: shared TypeScript types (`User`, `Account`, etc.).

## References for Deeper Integration

- Options schema (from `better-auth/dist/shared/better-auth.B955zZIT.d.ts`):
  - Review `emailAndPassword` options for toggling signup, verification, password rules.
  - `session.cookieCache`, `session.updateAge`, `session.freshAge` control semantics.
  - `rateLimit.storage` supports `"memory"`, `"database"`, `"secondary-storage"` depending on adapter.
- Adapters:
  - `memoryAdapter(db, config?)` – easiest for prototyping, as we do now.
  - When we introduce Convex, expect to write a custom adapter using the adapter factory (see `better-auth/dist/shared/better-auth.BvvYEWCP.mjs`).
- Client fetch config lives in `better-auth/dist/shared/better-auth.DLt6eN7D.mjs`; we can hook into `fetchOptions` for custom headers or instrumentation.

---

These notes should be enough to guide further development (Convex adapters, multi-user admin roles, richer session policies) without having to spelunk the package again. Let me know if you want code snippets or scaffolding for the storage adapter when we switch away from in-memory.
