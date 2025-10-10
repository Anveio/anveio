# Design Doc: Static-First Post Publishing Architecture

## 1. Purpose & Scope
- **Problem**: Current blog posts are filesystem markdown with no revision history, limited media support, and no path to rich embeds. We need an admin UI plus backend that handles arbitrary media, revision workflows, and high-performance delivery.
- **Scope**: Define the data model, publishing workflow, artifact format, and runtime architecture for posts created in Convex and served through Next.js with near-zero paint latency.
- **Out of scope**: Concrete editor implementation details (e.g., choosing TipTap vs. Lexical), analytics/engagement widgets, localization, and monetization. These move to an implementation doc after this design is approved.

## 2. Goals & Non-Goals
- **Goals**
  - Deliver SEO-friendly static pages with deterministic first paint and minimal layout shift.
  - Model posts as composable fragments that support text, images, video, WebGL, and React components.
  - Provide revision history, authorship tracking, and safe publishing with rollback.
  - Keep the runtime rendering path cacheable via CDN while allowing dynamic augmentations (likes, comments).
  - Ensure every media asset has structured metadata for responsive placeholders and accessibility.
- **Non-Goals**
  - Real-time collaborative editing.
  - Full CMS for arbitrary content types.
  - Binary compatibility with existing markdown posts (migration will transform content).

## 3. Domain Model Overview
| Entity | Purpose | Key Fields | Notes |
| --- | --- | --- | --- |
| `post` | Canonical record for a blog entry | `publicId`, `slug`, `title`, `primaryAuthorId`, `currentPublishedRevisionId`, `createdAt`, `updatedAt`, `status` | Holds stable metadata and pointers to revisions and publication artifacts. |
| `postRevision` | Snapshot of a post at a point in time | `postId`, `revisionNumber`, `fragmentsChecksum`, `state` (`draft` \| `ready` \| `published` \| `archived`), `createdBy`, `createdAt`, `note` | Immutable once published; can be promoted to published state. |
| `postFragment` | Ordered content block belonging to a revision | `revisionId`, `position`, `displayPriority`, `kind`, `payload`, `payloadVersion`, `createdAt` | Represents typed content (text, image, component, etc.) with validated payload. |
| `media` | Managed asset metadata wrapping Convex storage | `publicId`, `storageId`, `filename`, `mimeType`, `width`, `height`, `alt`, `caption`, `uploadedBy`, `createdAt` | Used for inline media and featured images; featured images reference this id. |
| `postFragmentAsset` | Join table for fragments to media | `fragmentId`, `mediaId`, `role` (`primary` \| `poster` \| `thumbnail`) | Simplifies analytics and cleanup of unused media. |
| `postPublication` | Record of a publish event | `postId`, `revisionId`, `artifactVersion`, `artifactPath`, `publishedAt`, `publishedBy`, `cdnInvalidationStatus` | Allows audit history and rollback. |
| `tag` | Controlled vocabulary tag | `name`, `slug`, `description`, `color`, `createdAt`, `updatedAt` | |
| `postTag` | Join between posts and tags | `postId`, `tagId`, `createdAt` | |
| `postReadModel` (optional cache) | Denormalized snapshot for list views | `postId`, `artifactVersion`, `excerpt`, `leadImage`, `leadText`, `updatedAt` | Can be regenerated on publish for fast landing pages. |

### Entity Relationships & Invariants
- `post` 1→N `postRevision`; `postRevision` 1→N `postFragment`.
- Exactly one `postRevision` per `post` is marked `published` at any time; `post.currentPublishedRevisionId` mirrors this.
- `postFragment.position` is dense starting at 0; `displayPriority` informs chunking but does not affect order.
- `postPublication` entries reference immutable artifacts; re-publishing creates a new artifact version.
- All media used by a revision must appear in `postFragmentAsset`; GC tasks delete media only after no references remain.

## 4. Fragment Type System
We model fragments as a discriminated union. Each `payload` includes a `payloadVersion` for future migrations and must validate against a zod schema before storage or publish.

```ts
type FragmentPayload =
  | { kind: 'text'; payloadVersion: '1'; prose: TipTapJSON }
  | { kind: 'image'; payloadVersion: '1'; mediaId: Id<'media'>; layout: 'inline' | 'breakout' | 'fullscreen'; width: number; height: number; alt: string; caption?: string; focalPoint?: { x: number; y: number } }
  | { kind: 'video'; payloadVersion: '1'; source: { type: 'media'; mediaId: Id<'media'> } | { type: 'external'; url: string }; posterMediaId?: Id<'media'>; aspectRatio: string; autoplay: boolean; loop: boolean; controls: boolean; caption?: string }
  | { kind: 'component'; payloadVersion: '1'; componentKey: string; props: ComponentPropsJSON; hydrate: 'static' | 'client' | 'none' }
  | { kind: 'webgl'; payloadVersion: '1'; sceneKey: string; props: ComponentPropsJSON; fallbackImageMediaId?: Id<'media'>; aspectRatio: string }
```

#### Validation & Tooling
- Use shared zod schemas for each fragment kind to guard Convex mutations and Next.js renderers.
- `ComponentPropsJSON` stores validated props; each registry entry supplies its own schema.
- `TipTapJSON` schema ensures text fragments serialize to a bounded AST with character counts for excerpt generation.
- During publish, fragments run through `assertPublishableFragment(fragment)` which checks media availability, layout constraints (e.g., `fullscreen` images must set `alt`), and ensures referenced components are whitelisted.

## 5. Publish Pipeline
### Trigger Points
- Manual publish action in admin UI.
- Scheduled publish timestamp via background job.
- Automated conversions (e.g., import pipeline) explicitly call the publish mutation.

### Steps
1. **Freeze Revision**: Ensure the selected `postRevision` state is `ready`. Lock further edits or clone to a new revision for continued drafting.
2. **Validate**: Run fragment validation plus cross-cutting checks (SEO metadata present, featured image optional but flagged if missing).
3. **Assemble Artifact**: Build a render artifact:
   ```json
   {
     "version": "2024-10-01",
     "post": {
       "slug": "future-of-rendering",
       "title": "Future of Rendering",
       "seo": { "description": "...", "openGraphImage": "media://med_abc" },
       "canonicalUrl": "https://anveio.com/posts/future-of-rendering"
     },
     "introHtmlPath": "intro.html",
     "fragments": [
       { "priority": "intro", "startWord": 0, "endWord": 420, "fragment": { "kind": "text", "...": "..." } },
       { "priority": "intro", "fragment": { "kind": "image", "...": "..." } },
       { "priority": "body", "fragment": { "kind": "text", "...": "..." } }
     ],
     "chunks": [
       { "priority": "intro", "byteLength": 18000, "fragmentIndexes": [0, 1] },
       { "priority": "body", "byteLength": 45000, "fragmentIndexes": [2, 3, 4] }
     ],
     "assets": [
       { "mediaId": "med_xyz", "url": "https://cdn.anveio.com/med_xyz.webp", "width": 1920, "height": 1080 }
     ],
     "components": [
       { "key": "react/app-demo", "hydration": "client", "propsSchemaVersion": "1" }
     ]
   }
  ```
  - `introHtmlPath` points to the prerendered HTML stored alongside the artifact for instant TTFB.
  - `fragments` embed the validated payloads.
   - `chunks` describe how SSR should stream fragments (intro vs. body).
   - `assets` include intrinsic dimensions so the reader can reserve space.
  - `components` map fragment component keys to registry metadata (hydration mode, prop schema version).
4. **Persist Artifact**: Upload the JSON artifact and prerendered intro HTML to Amazon S3 (`POST_ARTIFACT_BUCKET`). Naming: `posts/{slug}/{revisionNumber}-{hash}/artifact.json` and `posts/{slug}/{revisionNumber}-{hash}/intro.html`. The hash ensures immutability and unlocks aggressive CDN caching.
5. **Record Publication**: Create `postPublication` row referencing artifact paths and mark `post.currentPublishedRevisionId`.
6. **Invalidate Cache**: Kick Vercel revalidation or CDN purge using artifact path. Because URLs are versioned, stale caches fall off naturally; we still purge route caches for index pages pulling preview data.
7. **Emit Read Model**: Optional job to hydrate `postReadModel` for indexes and feeds.

### Failure Modes & Recovery
- Chunk size limit ensures artifacts stay < 1 MB. If exceeded, we fail publish with guidance.
- Validation failures return actionable errors referencing fragment IDs.
- Partial publish failure rolls back `post.currentPublishedRevisionId` update and leaves previous artifact live.

## 6. Read Path Architecture
- **Static Route Generation**: `app/posts/[slug]/page.tsx` loads the `post` record during `generateStaticParams` using cached `post.currentPublishedRevisionId`. It derives the artifact paths (JSON + intro HTML) and fetches them with `fetchCache: 'force-cache'` so Vercel can prerender at build time or on first request.
- **SSR Phase**: The server responds with the stored intro HTML as the first flush, then hydrates it with React components generated via `renderIntroChunk(artifact, introHtml)`. Images emit `next/image` with `placeholder="blur"` using `assets`. React/WebGL fragments marked `hydrate: 'client'` render shells sized from registry metadata.
- **Streaming Body**: Additional chunks load via route segment streaming or a client helper (`hydrateFragmentChunks(artifact)`) that consumes the shared JSON schema. Suspense boundaries prevent jank while later chunks hydrate.
- **Dynamic Enhancements**: Widgets like likes, view counts, or live comments mount after hydration using a dedicated hook that fetches from Convex. Because static markup already contains placeholders, layout shift is avoided.
- **Back/Forward & Scroll Restoration**: We rely on Next.js App Router defaults and avoid manual scroll management. Chunk loader caches previous chunk data in `sessionStorage` keyed by artifact hash to restore state on navigation.

## 7. Admin & Editing Experience
- **Revision Timeline**: Admin UI lists revisions with status, author, timestamp, diff summary (fragment count, word delta). Clone revision to continue editing without touching published version.
- **Fragment Editor**: Abstracted editor surfaces typed blocks. Each fragment carries metadata for display priority and layout hints.
- **Component Registry**: `fragmentComponents` map keys to React modules, hydration modes, and zod prop schemas. Admin picker and publish pipeline both consume this registry so validation and rendering stay in sync.
- **Media Library**: Backed by `media` table, supports search, filter by uploader/type, inline edits to alt/caption.
- **Publish Workflow**: CTA surfaces validation warnings before final publish. Optionally schedule by setting `postRevision.publishAt`.
- **Preview Flow**: Dedicated preview route loads revision to mimic artifact render without storing the artifact. Access gated via admin session plus signed token so creative collaborators can preview without full login if needed.
- **Convex API Surface**
  - Mutations: `createPost`, `createRevision`, `updateFragment`, `reorderFragments`, `deleteFragment`, `schedulePublish`, `publishRevision`.
  - Queries: `listPosts`, `getRevision`, `listRevisions`, `listMedia`, `getArtifactMetadata`.
  - Jobs: `executeScheduledPublishes`, `emitReadModel`.

## 8. Testing & Observability
- **Unit Tests**: Vitest for fragment validators, chunking algorithm, artifact builder. Property-based tests ensure chunk sizes and ordering invariants hold.
- **Integration Tests**: Convex mutation tests to verify publish pipeline; Playwright scenarios for admin editor (create fragment, publish, view artifact).
- **Static Render Tests**: Snapshot the intro chunk HTML to catch regressions in placeholder rendering.
- **Runtime Instrumentation**: Log artifact generation metrics (size, fragment counts, time). Add Next.js instrumentation to measure TTFB and LCP per post.
- **Error Reporting**: Publish pipeline pushes structured errors to a monitoring channel (e.g., Sentry) with fragment IDs for quick fixes.

## 9. Migration Plan
- Phase 1: Import existing markdown posts into `post`/`postRevision` with single text fragment plus extracted front matter. Generate initial artifacts so legacy routes switch seamlessly.
- Phase 2: Backfill media records for images referenced in markdown; mark fragments as `kind: 'text'` until re-authored.
- Phase 3: Deprecate filesystem `content/posts` pipeline once Convex posts serve in production. Archive markdown for posterity.

## 10. Next Steps
1. Provision development and production S3 buckets via AWS CDK, along with IAM users/policies scoped to each environment, then surface credentials through Vercel and Convex env vars.
2. Draft an implementation plan that sequences schema changes, publish pipeline, Next.js read path, and admin UI work.
3. Prototype fragment validators, artifact builder (JSON + intro HTML), and the shared `fragmentComponents` registry to de-risk chunk sizing and hydration.
