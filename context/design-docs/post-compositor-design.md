# Posts Are Authored in Code

This document previously described the Convex-backed “post compositor” and rich editor. That architecture has been decommissioned.

Blog posts now live as React (or Markdown) modules inside the repository. Authors compose prose directly in code, and Git provides the revision history. There is no Convex schema, editor surface, or fragment registry for posts any longer.

Future platform notes should focus on:

- authoring ergonomics for code-first posts (shared components, MDX utilities, lint rules),
- publishing conventions (directory layout, metadata helpers, preview builds), and
- tooling that accelerates review without reintroducing a database layer.

Any effort to reintroduce a database-backed compositor needs a fresh design doc that reconciles with the current code-authored workflow.
