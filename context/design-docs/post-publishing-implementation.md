# Implementation Plan: Static-First Post Publishing

## 0. Guiding Principles
- Work in vertical slices that end with observable value (e.g., schema + tests + minimal UI hook).
- Keep type safety enforced at every layer (Convex validators, zod schemas, TS types).
- “Make it work → make it good → make it fast”: ship a functional baseline, then harden, then optimize.
- Treat S3 artifacts as immutable; all mutations go through Convex transactions guarded by validations.
- Every behavior change lands with tests: unit (Vitest), integration (Convex), end-to-end (Playwright), or snapshots as appropriate.

## 1. Prerequisites & Tooling
1. **AWS CDK Stack**
   - Author CDK app (TypeScript) under `infra/cdk` that defines:
     - `anveio-post-artifacts-dev` and `anveio-post-artifacts-prod` S3 buckets (versioned, SSE-S3, public access blocked).
     - IAM users (`postArtifactsDevUser`, `postArtifactsProdUser`) with inline policies for scoped bucket access (`s3:GetObject`, `PutObject`, `DeleteObject`, `ListBucket` limited to `posts/*`).
     - Optional lifecycle rule: transition non-current versions to Glacier after 90 days.
     - AWS Secrets Manager entries or local script hooks for creating/rotating access keys (see rotation docs below).
   - CDK outputs access keys/secret (stored via AWS Secrets Manager or locally for initial setup).
   - Deployment commands: `cd infra/cdk && npm install && npx cdk synth && npx cdk deploy --all`.
   - Tests: CDK assertions (e.g., `@aws-cdk/assertions`) verifying policies and bucket configuration.
   - Deliverables: rotation scripts (`scripts/rotate-post-artifacts-dev-key.sh`, `...-prod-key.sh`) plus documentation (`context/runbooks/aws-key-rotation.md`) describing rotation cadence and manual steps.
2. **Environment Variable Wiring**
   - Add required vars to Vercel (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `POST_ARTIFACT_BUCKET`) for Dev/Preview/Prod environments.
   - Mirror credentials in Convex environment settings and `.env.local` via `vercel env pull`.
   - Document rotation procedure (Calendar reminder + `aws iam update-access-key`).
3. **Shared S3 Utility**
   - Create `lib/storage/postArtifacts.ts` exposing `uploadArtifact`, `deleteArtifactVersion`, `getArtifact`.
   - Use AWS SDK v3 with dependency injection (pass credentials via env).
   - Unit tests mocking AWS calls (`jest-mock-aws` or custom mock).

Exit criteria: CDK stack deployed in dev, environment variables available, utility functions passing unit tests.

## 2. Data Model & Convex Schema
Tasks:
1. Update `convex/schema.ts` with tables:
   - `post`, `postRevision`, `postFragment`, `postFragmentAsset`, `postPublication`, `tag`, `postTag`.
   - Enforce indexes described in design doc.
2. Add zod schemas mirroring fragment payloads under `convex/validators/postFragments.ts`.
3. Implement Convex mutations/queries stubs with type-safe signatures.
4. Migration script (`scripts/migrate-post-schema.mjs`) to backfill existing markdown posts into new tables (Phase 1 placeholder).

Tests:
- Vitest coverage for validators (valid/invalid fragments, payload version checks).
- Convex unit tests (`convex/test.ts`) ensuring indexes enforce uniqueness and validators are used.

Exit criteria: Convex typecheck passes; schema deployable to dev; validators exported for UI.

## 3. Fragment Component Registry
Tasks:
1. Create `app/(admin)/lib/fragmentRegistry.ts` exporting `fragmentComponents` map with entries `{ key, hydration, propsSchema }`.
2. Define shared TypeScript types (`lib/posts/fragments.ts`) and re-export zod schemas for both Convex and Next.js.
3. Add tests verifying registry entries conform to schema and hydration mode enumerate (`'static' | 'client' | 'none'`).
4. Set up lint rule or test ensuring every registry entry supplies a `propsSchema`.

Exit criteria: Registry consumed by both admin UI and publish pipeline without circular deps.

## 4. Publish Pipeline
Tasks:
1. Implement Convex mutation `publishRevision`:
   - Lock revision, validate fragments, assemble artifact JSON, render intro HTML using shared renderer (`lib/posts/publish/renderIntro.tsx` with React server-side rendering).
   - Upload both files to S3 via utility.
   - Record `postPublication` entry and update `post.currentPublishedRevisionId`.
2. Add helper `buildArtifact` returning JSON + HTML + metrics.
3. Guard with transaction semantics (Convex `db.transaction` where available).
4. Implement `schedulePublish` job + background worker to trigger at specified timestamps.
5. Write unit tests for `buildArtifact` (input fixtures → JSON structure snapshot).
6. Integration test: publish flow with mocked S3; ensure rollback on failure.

Exit criteria: End-to-end Convex test publishing a sample post writes artifact files (mocked) and updates tables correctly.

## 5. Next.js Read Path
Tasks:
1. Add server loader `lib/posts/getPublishedArtifact.ts` reading from Convex + fetching S3 JSON/HTML.
2. Update `app/posts/[slug]/page.tsx` to:
   - Use `generateStaticParams` reading list of published slugs from Convex.
   - Fetch artifact JSON + intro HTML with caching hints (`fetchCache: 'force-cache'`).
   - Render intro HTML directly, hydrate with `hydrateFragmentChunks`.
   - Stream subsequent chunks via Suspense or route segment (introduce `app/posts/[slug]/chunks.tsx` if needed).
3. Add `lib/posts/hydrateFragmentChunks.tsx` converting artifact JSON to React components (shared between SSR and client).
4. Ensure images use `next/image` with placeholders; components use registry hydration metadata.
5. Tests: React testing library snapshot for intro render; integration route test verifying correct headers & caching; Playwright scenario to assert zero layout shift (use performance API or screenshot diff).

Exit criteria: Visiting `/posts/demo` in dev renders from artifact; hydration logs clean; SEO metadata unaffected.

## 6. Admin UI Enhancements
Tasks:
1. Create admin routes under `app/admin/posts`:
   - List view showing posts, status, current published revision, publish actions.
   - Revision detail page with fragment editor (stub initial version with manual JSON editing if necessary).
2. Integrate fragment registry for block selection, preview.
3. Add media library UI hooking into existing `media` table; ensure uploads capture intrinsic dimensions.
4. Implement publish workflow UI calling Convex `publishRevision`.
5. Tests: Playwright admin scenario (create draft, add fragment, preview, publish); component tests for fragment editor (render text/image).

Exit criteria: Admin can create draft, upload image, publish, and see result on public route.

## 7. Migration & Legacy Content
Tasks:
1. Implement script converting `content/posts/*.md` into `post`, `postRevision`, `postFragment` records (`scripts/import-legacy-posts.mjs`).
2. Seed script uploads initial artifacts via publish pipeline (ensures consistency).
3. Update documentation directing contributors to new system; mark markdown path as deprecated.

Exit criteria: All legacy posts available through new render path; tests updated to read from Convex.

## 8. Observability & Operations
Tasks:
1. Add logging (`lib/logging/publish.ts`) for artifact generation metrics (size, chunk counts, time).
2. Wire logs into Vercel/Convex observability (e.g., console instrumentation, Sentry capture).
3. Set up alarms for S3 bucket errors or artifact upload failures (CloudWatch or third-party).
4. Define runbooks in `context/runbooks/post-publishing.md`.

Exit criteria: Operators can trace publish events and diagnose failures quickly.

## 9. Verification & Rollout Checklist
- [ ] CDK stack deployed to prod; credentials rotated once as rehearsal.
- [ ] Schema deployed; Convex migrations complete.
- [ ] Publish pipeline validated via integration tests.
- [ ] Admin UI E2E test green in CI.
- [ ] Next.js route lighthouse score checked (TTFB, LCP thresholds <= 1s on fast 3G).
- [ ] Legacy posts migrated; markdown fallback removed.
- [ ] Documentation updated: `README.md`, `AGENTS.md`, `context/design-docs` cross-references.

## 10. Timeline Sketch (indicative)
| Week | Focus | Key Deliverables |
| --- | --- | --- |
| 1 | Infra & Schema | CDK stacks, environment variables, schema deployed, validators tested |
| 2 | Publish Pipeline | `publishRevision`, artifact builder, S3 integration tests |
| 3 | Read Path | Next.js loader/hydrator, intro HTML streaming |
| 4 | Admin UI v1 | Draft editor, media management basics |
| 5 | Migration & Polish | Legacy import, performance tuning, documentation |

Adjust timeline as team capacity changes; each week should end with demoable progress.
