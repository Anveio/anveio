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

For a personal blog, Convex storage provides excellent performance without operational complexity.

## Admin Panel

There is a password-protected dashboard at `/admin`. It currently lists existing posts and holds space for the forthcoming composer.

1. Copy `.env.example` to `.env.local`.
2. Provide values for:
   - `BETTER_AUTH_SECRET` – a long random string (32+ chars).
   - `RESEND_API_KEY` – the Resend credential for outbound email.
   - `NEXT_PUBLIC_CONVEX_SITE_URL` and `NEXT_PUBLIC_CONVEX_URL` – Convex deployment metadata (copy from `npx convex dev --once`).
   - Optional: `AUTH_BASE_URL` to override the base URL used by Better Auth (defaults to Vercel-provided origin or `http://localhost:3000`).
3. Deploy the same variables in Vercel (`vercel env pull` keeps local copies in sync) and mirror them into Convex with `npx convex env set`.
4. Visit `/admin/login`, sign in, and you’ll be redirected to the dashboard.
5. When you need to recreate the admin account, open the Convex dashboard and run the action `dev.seedAdmin`, passing `{ email, password, name? }`. The action enforces the admin role and syncs existing sessions.

Authentication now runs entirely through Convex using the Better Auth component, so user/session data persists across deploys.

## Deployment Notes

The app is SSR-first (`export const dynamic = "force-dynamic"` on each route), so it can run on any Node-friendly platform. Vercel is the default target, but the standalone build works equally well on Fly.io, Render, or bare EC2.
