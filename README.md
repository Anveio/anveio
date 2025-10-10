# Shovon Hasan — Personal Site

This repository hosts my personal site and blog. The goal is to publish systems engineering essays with the kind of minimal, reader-first presentation you might expect from Dan Luu or other classic text-heavy blogs.

## Stack

- [Next.js](https://nextjs.org/) using the App Router with server-side rendering forced for every page
- Minimal bespoke CSS (no Tailwind, no component frameworks) — the markup and layout intentionally mirror [Dan Luu’s blog](https://danluu.com/)
- Markdown posts parsed with [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and rendered with [`marked`](https://github.com/markedjs/marked)

## Getting Started

```bash
npm install
npm run dev   # http://localhost:3000
```

`npm` is the reference workflow for local development and deployment. Bun continues to work if you prefer it, but make sure every change also passes the `npm` scripts listed below before shipping.

## Writing Posts

We want to change this. Create a new Markdown file inside `content/posts` with front matter for `title`, `summary`, and `publishedAt`. Example:

```markdown
---
title: "Boring Systems Win"
summary: "The best compliment I hear on-call is about how uneventful the night was."
publishedAt: "2025-01-18"
---

Your essay goes here. Markdown headings, lists, code blocks, and emphasis are all supported.
```

The homepage automatically lists posts in reverse chronological order, and individual posts render at `/blog/<slug>`.

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

## Preparing for the Convex CMS

The blog still reads Markdown files from `content/posts`. When we introduce Convex, we will migrate the loader in `lib/posts.ts` behind a new data-access layer. To start a fresh Convex project when you are ready:

```bash
npm install convex
npx convex dev
```

This outputs the `CONVEX_DEPLOYMENT` and `CONVEX_URL` values you will eventually copy into Vercel project settings. Mirror them locally by copying `.env.example` to `.env.local` and filling in each variable. Hold off on committing Convex-generated files until the CMS implementation lands; the codebase already treats the filesystem reader as an adapter we can swap.

## Admin Panel

There is a password-protected dashboard at `/admin`. It currently lists existing posts and holds space for the forthcoming composer.

1. Copy `.env.example` to `.env.local`.
2. Provide values for:
   - `BETTER_AUTH_SECRET` – a long random string (32+ chars).
   - `ADMIN_EMAIL` – the account you will log in with.
   - `ADMIN_PASSWORD` – the plaintext password for that account.
   - Optional: `ADMIN_NAME` and `AUTH_BASE_URL` (defaults to Vercel URL or `http://localhost:3000`).
3. Deploy the same variables in Vercel (`vercel env pull` keeps local copies in sync).
4. Visit `/admin/login`, sign in, and you’ll be redirected to the dashboard.

Better Auth stores credentials in an in-memory adapter for now; expect to replace that with Convex once the CMS lands.

## Deployment Notes

The app is SSR-first (`export const dynamic = "force-dynamic"` on each route), so it can run on any Node-friendly platform. Vercel is the default target, but the standalone build works equally well on Fly.io, Render, or bare EC2.
