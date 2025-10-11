# Convex Schema Notes

- `schema/user.ts` owns the core identity table.
- `schema/session.ts` groups active session + MFA credentials.
- `schema/account.ts` aggregates external account, OAuth, and rate limit tables.
- `schema/content.ts` co-locates post, fragment, and media tables with the fragment validators/types.
- `schema.ts` re-exports the validators/types from `schema/content.ts` and composes the full schema for Convex.
