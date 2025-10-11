# Design Doc: Static-First Post Publishing Architecture

## 1. Purpose & Scope
- **Problem**: Filesystem Markdown leaves us without an admin experience, no structured media support, and no path to streaming rich posts. We need a Convex-backed model plus a Next.js render pipeline that keeps latency near zero.
- **Scope**: Define the schema, publish pipeline, artifact shape, and runtime wiring for posts created in Convex and rendered by Next.js. We explicitly optimise for draft→publish workflows without keeping a long-term history of edits.
- **Out of Scope**: Collaborative editing, multi-language content, analytics/engagement features, monetisation. We can revisit once the core pipeline ships.

## 2. Goals & Non-Goals
- **Goals**
  - Serve SEO-friendly static pages with deterministic first paint and minimal layout shift.
  - Support a two-stage editing flow (draft vs. published) without storing historical revisions.
  - Model rich fragments (text, image, video, React, WebGL) with strong validation.
  - Generate immutable publish artifacts for CDN caching while allowing fast draft previews.
  - Keep the data model simple enough to reason about, but extensible for future media types.
- **Non-Goals**
  - Audit trails or undo stacks for past edits (we discard prior versions once a new publish succeeds).
  - Full CMS with arbitrary content types.
  - Migrating additional consumer apps beyond the blog.

## 3. Domain Model Overview
| Entity | Purpose | Key Fields | Notes |
| --- | --- | --- | --- |
| `post` | Canonical metadata for a blog entry | `publicId`, `slug`, `title`, `summary`, `primaryAuthorId`, `status`, `currentVersion`, `publishedVersion`, `featuredMediaId`, `seo*`, `createdAt`, `updatedAt`, `publishedAt` | Single source of truth. `status` reflects the current draft/published state. No separate revision rows. |
| `postFragment` | Ordered fragments belonging to a post/stage | `publicId`, `postId`, `stage` (`draft` \| `published`), `position`, `displayPriority`, `payload`, `version`, `createdAt`, `updatedAt` | Draft mutations operate on `stage='draft'`. Publish clones draft fragments into the `published` stage. |
| `postFragmentAsset` | Join between fragments and media | `publicId`, `postId`, `stage`, `fragmentId`, `mediaId`, `role`, `createdAt` | Enables analytics and GC for unused media. Stage ensures we know whether draft or published references the asset. |
| `postPublication` | Publish event log | `publicId`, `postId`, `publishedAt`, `publishedBy`, `createdAt` | Lightweight audit of when a post was published and by whom. |
| `tag` | Controlled vocabulary | `publicId`, `name`, `slug`, `description`, `color`, `createdAt`, `updatedAt` | |
| `postTag` | Post↔tag mapping | `publicId`, `postId`, `tagId`, `createdAt` | |
| `media` | Asset metadata tied to Convex storage | `publicId`, `storageId`, `filename`, `mimeType`, `width`, `height`, `alt`, `caption`, `uploadedBy`, `tags`, `isPublic`, `createdAt`, `updatedAt` | Inline and featured assets share this table. |

**Invariants**
- `position` within a `(postId, stage)` tuple is dense starting from 0.
- On publish, we transactionally copy all draft fragments to the published stage, then bump `post.publishedVersion`.
- We do not persist prior fragment versions; once new published fragments replace old ones, the old set is deleted.

## 4. Fragment Type System
Fragments remain a discriminated union validated with Convex validators:
```ts
type FragmentPayload =
  | { kind: 'text'; version: '1'; editorState: string; wordCount: number }
  | { kind: 'image'; version: '1'; mediaId: Id<'media'>; layout: 'inline' | 'breakout' | 'fullscreen'; width: number; height: number; alt: string; caption?: string; focalPoint?: { x: number; y: number } }
  | { kind: 'video'; version: '1'; source: { type: 'media'; mediaId: Id<'media'> } | { type: 'external'; url: string }; posterMediaId?: Id<'media'>; aspectRatio: string; autoplay: boolean; loop: boolean; controls: boolean; caption?: string }
  | { kind: 'component'; version: '1'; componentKey: string; propsJson: string; hydration: 'static' | 'client' | 'none' }
  | { kind: 'webgl'; version: '1'; sceneKey: string; propsJson: string; fallbackMediaId?: Id<'media'>; aspectRatio: string }
```
Validation lives in `convex/schema/postFragments.ts`, and both Convex mutations and Next.js code import types from there.

## 5. Publish Pipeline
### Trigger Options
- Manual publish via the admin UI.
- Scheduled publish (optional) triggered by a Convex cron when `post.scheduledPublishAt` ≤ now.

### Steps
1. **Validate Draft**: Ensure draft fragments exist, payloads pass validation, required SEO fields are set, and media/component references resolve.
2. **Generate Artifact**: Build immutable publish artefacts (JSON + intro HTML) with chunk metadata, asset manifest, and component hydration info.
3. **Transactional Publish**:
   - Copy all draft fragments to the `published` stage (delete existing published fragments first).
   - Update `post`: set `publishedAt` and `status='published'`.
   - Insert a `postPublication` entry noting who published and when.
4. **Invalidate Cache**: Kick Vercel/CloudFront purge based on the artefact path hash.
5. **Emit Read Model (optional)**: Update any denormalised listing caches.

If any step fails, the transaction rolls back leaving the last published version intact.

## 6. Read Path Architecture
- **Static Generation**: `app/posts/[slug]/page.tsx` fetches `post` metadata and the latest published artefact (JSON + intro HTML) using `fetchCache: 'force-cache'` so first render is static.
- **SSR**: Intro chunk HTML is streamed immediately; subsequent chunks hydrate via Suspense boundaries fed by the JSON artifact. Since layout metadata includes dimensions/aspect ratios, there is no layout shift.
- **Dynamic Enhancements**: Post-render widgets (likes, comments) load from dedicated APIs and do not alter the static artefact.
- **Navigation**: We cache chunk JSON in `sessionStorage` keyed by artefact hash to restore scroll/back/forward instantly.

## 7. Admin & Editing Experience
- Draft fragments drive the editor. Mutations maintain ordering and `displayPriority`.
- Publishing clones the draft stage; no historical versions survive beyond the immutable artefact stored in S3.
- Admin UI requirements:
  - Post list with status, current version, latest publish timestamp.
  - Draft editor: manipulate the fragment list, upload media, preview component embeds (registry-driven).
  - Publish CTA with validation summaries and optional scheduling.
  - Media library with search and metadata editing.

## 8. Testing & Observability
- **Unit Tests**: Fragment validators, draft→published copy logic, artefact builder.
- **Integration Tests**: Publish mutation with mocked S3, ensuring atomic replacement of published fragments.
- **E2E**: Playwright flows for editor + publish, SSR snapshot tests for intro chunk.
- **Observability**: Log publish metrics (fragment counts, artefact size). Capture errors in Sentry with payload summaries. Track scheduled publish outcomes.

## 9. Migration Plan
- Import existing Markdown posts into `post` and `postFragment` with `stage='draft'` and immediately publish them to seed the published stage.
- Backfill media records for referenced assets.
- Update documentation to point authors at the new admin surface; archive Markdown files once the Convex path serves production traffic.

## 10. Next Steps
1. Finish schema updates (post, postFragment with stage, postPublication, joins) and regenerate Convex types.
2. Implement mutations/queries: create/update fragments, maintain ordering, publish pipeline with S3 uploads.
3. Integrate the admin UI with the registry and fragment APIs.
4. Build the Next.js read path and streaming client helpers.
5. Spin up monitoring (logs, alerts) for publish operations.
