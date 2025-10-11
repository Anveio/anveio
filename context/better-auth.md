# Better Auth Integration Notes

Collected details on how Better Auth is wired into this project, current constraints, and opportunities for the upcoming CMS work.

## Core Concepts

- **Entry point**: `betterAuth(options)` returns an `auth` object that exposes handlers (`auth.handler`/`auth.api.*`) plus typed helpers (e.g., `auth.api.getSession`).
- **Adapters**: Better Auth expects a database adapter that implements CRUD for `user`, `account`, `session`, and `verification` models. We currently use the in-memory adapter (`better-auth/adapters/memory`) which stores data in plain arrays.
- **Hashing**: Passwords go through Better Auth’s `hashPassword` (scrypt-based). Verification is handled by `verifyPassword` internally.
- **Next.js bridge**: The `better-auth/next-js` integration provides `nextJsHandler` for API routes and `nextCookies()` plugin to sync Set-Cookie headers with Next’s `cookies()` helper.
- **Client SDK**: `better-auth/react` exposes `createAuthClient`, which builds a fetch proxy for hitting Better Auth routes from client components. Includes session atom hooks.
- **Configuration validation**: Our `lib/env.ts` uses `zod` to make sure required env vars (`BETTER_AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) exist before auth initializes.
- **Session helpers**: `auth.api.getSession` returns `{ session, user }` or null; typing driven by Better Auth’s generated zod schemas.

## Current Setup in This Repo

- Auth logic lives in `lib/auth.ts`, written as a server-only module.
  - Uses `createNextAuth` to wrap the Convex-backed Better Auth instance with the Next-specific `nextCookies()` plugin.
  - Pulls base URL and secrets from `lib/env.ts` which now validates the Convex deployment metadata alongside Better Auth secrets.
  - Exports both the configured `auth` instance and `createNextAuth` helper for request-scoped usage.
- Convex hosts the canonical Better Auth runtime.
  - `convex/http.ts` exposes Better Auth HTTP routes via `authComponent.registerRoutes`.
  - `convex/convex.config.ts` installs the Better Auth component, and `convex/auth.config.ts` declares Convex as a provider (using `CONVEX_SITE_URL`).
- API route `app/api/auth/[...betterAuth]/route.ts` proxies to Convex through `nextJsHandler({ convexSiteUrl })`.
- Client:
  - `lib/auth-client.ts` builds a fetch proxy pointed at `/api/auth`.
  - `components/admin/admin-login-form.tsx` uses `authClient.signIn.email`.
  - `components/admin/sign-out-button.tsx` uses `authClient.signOut`.
- Guards:
  - `lib/admin-session.ts` wraps `auth.api.getSession`, unwraps the Better Auth client response, enforces the admin role check via `isAdmin`, and exposes `requireAdminSession` for server routes/pages.
- Seeding:
  - Run the Convex action `dev.seedAdmin` from the dashboard to recreate the admin account using the env-configured credentials. The action marks the user as verified and syncs user/session roles so existing sessions reflect the admin upgrade.
## Working with the Adapter

- The Convex Better Auth component exposes an `authComponent` factory (`convex/auth.ts`), which we consume server-side via `createConvexAuthContext`.
- `createConvexAuthContext` instantiates a `ConvexHttpClient` with the admin token so Next.js can execute mutations/queries against the Convex deployment outside of Convex runtime.
- The component supplies a fully featured schema (`user`, `session`, `account`, `verification`, plus optional two-factor, passkey, and OAuth tables) defined in our `convex/schema.ts`.
- When we need to call Better Auth APIs inside Convex functions, use `authComponent.getAuth(ctx)` to get `{ auth, headers }` scoped to the current request.

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
  - `CONVEX_URL`
  - `CONVEX_SITE_URL`
  - `CONVEX_AUTH_SECRET`
  - Optional: `ADMIN_NAME`, `AUTH_BASE_URL`
- Our build step fails early if these are absent, so CI/Vercel must provide them.
- Convex stores auth data durably; admin provisioning will eventually be handled via Convex mutations (manual seeding TBD).

## Limitations & Next Steps

- **Single user**: We still keep `disableSignUp` true; plan multi-user support once admin provisioning flow exists.
- **Password resets & email verification**: disabled right now. Enabling them means providing email delivery hooks (`sendResetPassword`, `sendVerificationEmail` events).
- **Rate limiting**: off for now; we can enable the built-in database-backed limiter after production hardening.
- **Client session hook**: `authClient` exposes a `useSession` hook via Nanostores; we can integrate it when we build the admin composer UI.
- **Testing**: `@convex-dev/better-auth` ships adapter tests we can reuse; we should add integration tests that exercise Convex-backed auth flows.

## Useful Imports / Paths Recap

- `better-auth`: core runtime, `betterAuth` factory.
- `better-auth/next-js`: `nextCookies`.
- `@convex-dev/better-auth`: Convex component client + helpers.
- `better-auth/crypto`: `hashPassword`, `verifyPassword`.
- `better-auth/react`: client fetch proxy + hooks.
- `@better-auth/core/db`: shared TypeScript types (`User`, `Account`, etc.).

## References for Deeper Integration

- Options schema (from `better-auth/dist/shared/better-auth.B955zZIT.d.ts`):
  - Review `emailAndPassword` options for toggling signup, verification, password rules.
  - `session.cookieCache`, `session.updateAge`, `session.freshAge` control semantics.
  - `rateLimit.storage` supports `"memory"`, `"database"`, `"secondary-storage"` depending on adapter.
- Adapters:
  - The Convex adapter comes from `@convex-dev/better-auth`; we can extend triggers or local schema overrides in `convex/auth.ts`.
- Client fetch config lives in `better-auth/dist/shared/better-auth.DLt6eN7D.mjs`; we can hook into `fetchOptions` for custom headers or instrumentation.

---

These notes should be enough to guide further development (automated admin provisioning, richer session policies, multi-user roles) without having to spelunk the packages again. Let me know if you want code snippets or scaffolding for the remaining integrations.
