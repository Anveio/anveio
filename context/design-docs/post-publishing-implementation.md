# Post Publishing Implementation (Superseded)

All implementation plans targeting the Convex-backed post compositor are obsolete. We shut down that stack and returned to code-authored posts.

Operational truths now:

- No Convex tables exist for posts, fragments, publications, tags, or artefacts.
- There is no admin editor—the source of truth is the repository.
- Any automation around publishing should work with git (lint rules, PR previews, release tagging).

If a database-driven workflow becomes relevant again, start from a blank implementation plan that reflects the new requirements.
