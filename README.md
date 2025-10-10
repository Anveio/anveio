# Shovon Hasan — Personal Site

This repository hosts my personal site and blog. The goal is to publish systems engineering essays with the kind of minimal, reader-first presentation you might expect from Dan Luu or other classic text-heavy blogs.

## Stack

- [Next.js](https://nextjs.org/) using the App Router with server-side rendering forced for every page
- Minimal bespoke CSS (no Tailwind, no component frameworks), in the style of Dan Luu
- Markdown posts parsed with [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and rendered with [`marked`](https://github.com/markedjs/marked)

## Getting Started

```bash
bun install      # or npm install
bun run dev      # starts next dev on http://localhost:3000
```

The site uses Bun for package management in this repo, but `npm` works just as well.

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

- `bun run dev` – run the development server
- `bun run build` – create an optimized production build
- `bun run lint` – lint the codebase with Biome

## Deployment Notes

The app is SSR-first (`export const dynamic = "force-dynamic"` on each route), so deploy to any Node-friendly environment (Vercel, AWS, etc.) without additional configuration.
