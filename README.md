# Shovon Hasan — Personal Site

This repository hosts my personal site and blog. The goal is to publish systems engineering essays with the kind of minimal, reader-first presentation you might expect from Dan Luu or other classic text-heavy blogs.

## Stack

- [Next.js](https://nextjs.org/) using the App Router with server-side rendering forced for every page
- Tailwind CSS 4 providing the utility layer for both the blog and admin surfaces
- Markdown posts parsed with [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and rendered with [`marked`](https://github.com/markedjs/marked)

## Getting Started

```bash
npm install
npm run dev   # http://localhost:3000
```

`npm` is the reference workflow for local development and deployment. Bun continues to work if you prefer it, but make sure every change also passes the `npm` scripts listed below before shipping.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – produce a production build ready for Vercel
- `npm run lint` – lint the codebase with Biome
- `npm run typecheck` – run the TypeScript compiler in `--noEmit` mode

## Deploying to Vercel

1. Create a new Vercel project and import this repository. The defaults work: Vercel will run `npm install` followed by `npm run build`, then start the standalone output with `npm run start`.
2. Set the project to use Node.js 20 or later (Project Settings → Build & Development Settings → Node.js Version).
3. Trigger a deployment. Static assets (including `content/posts`) are bundled automatically, and every request is rendered on the server because each route opts into `force-dynamic`.

Before pushing, run `npm run lint`, `npm run typecheck`, and `npm run build` locally—those are the same checks Vercel will execute.

## Blog Architecture & Media Storage

### Content Management
The blog uses a **block-based content architecture** stored in Convex tables:
- **Posts**: Structured as arrays of content blocks (text, images, videos, WebGL, React components)
- **Media**: Centralized asset management with metadata (dimensions, alt text, captions)
- **Categories**: Hierarchical organization with many-to-many post relationships

### Public ID System
Following Stripe's API design, all resources have **prefixed public identifiers** alongside Convex's internal IDs:

- **Users**: `usr_1234567890abcdef`
- **Posts**: `pst_1234567890abcdef`
- **Media**: `med_1234567890abcdef`
- **Categories**: `cat_1234567890abcdef`
- **OAuth Clients**: `cid_1234567890abcdef`

**Benefits:**
- **API-friendly URLs**: `/admin/posts/pst_abc123def456` instead of cryptic internal IDs
- **Type safety**: Know resource type from ID prefix
- **External stability**: Public IDs remain constant even if internal schema changes
- **Collision prevention**: Prefixes eliminate cross-table ID confusion

Convex's system IDs remain for internal database operations and relationships, while public IDs provide a clean external interface.

### Media Storage Decision
**Images and files are stored in Convex's built-in file storage** rather than external services like S3:

**Benefits:**
- ✅ **Automatic CDN**: Global edge caching out of the box
- ✅ **Direct uploads**: Client-side file uploads without backend routing  
- ✅ **Tight integration**: Files referenced by ID in schema (`featuredImageId: v.id('_storage')`)
- ✅ **No infrastructure**: No S3 buckets, IAM policies, or CDN configuration
- ✅ **Signed URLs**: Secure, expiring URLs for private content

**Limits:**
- Free tier: 1GB storage, 1GB bandwidth/month
- Pro tier: 100GB storage, 1TB bandwidth/month  
- Max file size: 100MB per file

For a personal blog, Convex storage provides excellent performance without operational complexity.

### Setting Up Convex
To start the Convex backend:

```bash
npm install convex
npx convex dev
```

This outputs the `CONVEX_DEPLOYMENT` and `CONVEX_URL` values you will copy into Vercel project settings. Mirror them locally by copying `.env.example` to `.env.local` and filling in each variable.

## Admin Panel

There is a password-protected dashboard at `/admin`. It currently lists existing posts and holds space for the forthcoming composer.

1. Copy `.env.example` to `.env.local`.
2. Provide values for:
   - `BETTER_AUTH_SECRET` – a long random string (32+ chars).
   - `ADMIN_EMAIL` – the account you will log in with.
   - `ADMIN_PASSWORD` – the plaintext password for that account.
   - `CONVEX_URL` – the Convex deployment URL (ends in `.convex.cloud`).
   - `CONVEX_SITE_URL` – the paired site URL (ends in `.convex.site`).
   - `CONVEX_AUTH_SECRET` – a Convex admin token (create one from the dashboard).
   - Optional: `ADMIN_NAME` and `AUTH_BASE_URL` (defaults to Vercel URL or `http://localhost:3000`).
3. Deploy the same variables in Vercel (`vercel env pull` keeps local copies in sync) and set the Convex-side `SITE_URL` value with `npx convex env set SITE_URL http://localhost:3000`.
4. Visit `/admin/login`, sign in, and you’ll be redirected to the dashboard.
5. When you need to recreate the admin account locally, issue a `POST` to `${CONVEX_SITE_URL}/dev/seed-admin`. The action reuses the credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, enforces the admin role, and is hard-disabled (404) in production deployments.

Authentication now runs entirely through Convex using the Better Auth component, so user/session data persists across deploys.

## Deployment Notes

The app is SSR-first (`export const dynamic = "force-dynamic"` on each route), so it can run on any Node-friendly platform. Vercel is the default target, but the standalone build works equally well on Fly.io, Render, or bare EC2.
