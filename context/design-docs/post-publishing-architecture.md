# Post Publishing Architecture (Superseded)

The Convex-backed publishing system described in earlier iterations has been retired. Posts no longer persist in Convex tables (`post`, `postFragment`, `postFragmentAsset`, `postPublication`, `tag`, `postTag`, etc.), and there is no draft/publish workflow mediated by the database.

Current stance:

- Posts live in the repository as React or Markdown modules, committed through git.
- Publishing is identical to merging code; version history comes from the VCS.
- The Next.js runtime renders directly from those modules without fetching Convex data.

If we decide to explore a database-driven compositor again, start with a fresh design proposal that:

1. Motivates the shift away from code-authored posts.
2. Specifies migration steps between existing file-based content and the new storage model.
3. Updates operational runbooks (key rotation, seeding, observability) to match the new design.

Until then, treat this document as historical context only.
