# Implementation Plan: Static-First Post Publishing

## 0. Guiding Principles
- Deliver value in vertical slices: schema + validator + mutation + UI hook, verified by tests.
- Keep type safety strict. All payload validation flows through `convex/values` validators defined in `convex/schema/content.ts`.
- Prioritise fast publish flows over deep history. We only maintain draft and published stages—no revision log.
- Every behaviour change ships with tests (Vitest, Convex integration, Playwright) so the pipeline stays reliable.

## 1. Prerequisites & Tooling
1. **AWS CDK Stack** (completed): S3 buckets, IAM users, rotation scripts, runbook.
2. **Environment Variables**: Populate Vercel + Convex envs with S3 credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `POST_ARTIFACT_BUCKET`).
3. **S3 Utility Layer**: `lib/storage/postArtifacts.ts` with `uploadArtifact`, `deleteArtifact`, `getArtifact`. Mock AWS SDK in unit tests.

Exit criteria: CDK stack deployed, env vars present, storage utility tested.

## 2. Schema & Validators
Tasks:
1. Finalise schema updates for `post`, `postFragment` (with `stage`), `postFragmentAsset`, `postPublication`, `tag`, `postTag`.
2. Ensure all fragment validators live in `convex/schema/content.ts` and are exported for Convex + Next.js usage.
3. Regenerate Convex types (`npx convex codegen`) after schema changes.

Tests:
- Vitest coverage for validators (valid/invalid fragment payloads, hydration guards).
- Convex unit tests verifying index invariants (dense ordering, unique `(postId, stage, position)`).

Exit criteria: Convex deployable schema, validators reused across stack.

## 3. Fragment Component Registry
Tasks:
1. Expand `app/(admin)/lib/fragmentRegistry.ts` with real embeds (text, image, video, WebGL placeholders).
2. Ensure each entry exposes a Convex validator + dynamic import module.
3. Update tests to cover new entries and hydration modes.

Exit criteria: Registry used by admin editor and publish validator, tests green.

## 4. Draft Editing Mutations
Tasks:
1. Implement Convex mutations:
   - `createPost` (initial draft fragments optional).
   - `updatePostMetadata` (title, slug, SEO, status guard).
   - Fragment CRUD: `addFragment`, `updateFragment`, `reorderFragments`, `deleteFragment` targeting `stage='draft'`.
   - `setDraftFragments` helper for bulk operations (used by future editor batch saves).
2. Maintain dense `position` within transactions to avoid gaps.
3. Update `postFragmentAsset` records when fragments reference media.

Tests:
- Convex integration tests covering create/update/delete with concurrent operations.
- Ensure deleting a fragment removes orphaned `postFragmentAsset` rows.

Exit criteria: Draft editing API stable and transactionally consistent.

## 5. Publish Pipeline
Tasks:
1. Implement `publishPost` mutation:
   - Validate draft fragments + metadata using shared validators and registry.
   - Build artefact JSON + intro HTML (`lib/posts/publish/buildArtifact.ts`) and upload to S3.
   - Copy draft fragments to `stage='published'`, delete old published fragments, update `post` (`publishedAt`, `status`).
   - Insert `postPublication` log entry.
2. Add optional `schedulePublish` field + Convex cron job to trigger `publishPost`.
3. Handle rollback: if any step fails, nothing persists.

Tests:
- Vitest tests for artefact builder (fixtures → snapshot).
- Convex end-to-end test using mocked S3 to ensure transactional behaviour.

Exit criteria: Manual and scheduled publishes succeed; published fragments match draft at publish time.

## 6. Read Path
Tasks:
1. Implement `lib/posts/getPublishedArtifact.ts` fetching post metadata + S3 artefacts.
2. Create `lib/posts/hydrateFragmentChunks.tsx` to transform artefact JSON into React elements (shared SSR/client).
3. Update `app/posts/[slug]/page.tsx` to stream intro HTML + hydrate subsequent chunks.
4. Ensure images/components use manifest dimensions to prevent layout shift.

Tests:
- React Testing Library snapshot for intro chunk render.
- Integration route test verifying caching headers.
- Playwright check for zero layout shift on load.

Exit criteria: Published posts render via artefacts with streaming chunk hydration.

## 7. Admin UI
Tasks:
1. Build `app/admin/posts` list page with status filters, publish CTA, version info.
2. Implement draft editor using the fragment registry (text editing, media insertion, component picker).
3. Add publish dialog (validation summary, optional schedule time).
4. Media library integration for browsing/uploading assets.

Tests:
- Component tests for editor widgets.
- Playwright scenario: create post → edit fragments → publish → view published page.

Exit criteria: Admin can author posts end-to-end.

## 8. Migration & Legacy Content
Tasks:
1. Write `scripts/import-legacy-posts.mjs` to ingest Markdown into `post` + `postFragment` (both draft and published stages).
2. Upload legacy artefacts via publish pipeline.
3. Update docs/README to mark Markdown path as deprecated.

Exit criteria: Existing posts served via Convex pipeline; filesystem content archived.

## 9. Observability & Operations
Tasks:
1. Instrument publish pipeline with structured logs (artefact size, fragment counts, duration).
2. Add error reporting (Sentry) with payload summaries.
3. Document publish runbooks (failure recovery, cache invalidation).

Exit criteria: Operators can diagnose publish failures quickly.

## 10. Rollout Checklist
- [ ] Schema deployed and Convex codegen updated.
- [ ] Draft editing mutations tested in staging.
- [ ] Publish pipeline verified against staging bucket.
- [ ] Next.js read path deployed and Lighthouse (TTFB/LCP) validated.
- [ ] Admin UI E2E passing in CI.
- [ ] Legacy posts migrated; Markdown removed from prod builds.
- [ ] Runbooks and rotation docs updated.
