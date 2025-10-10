import "server-only"

import fs from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"
import { marked } from "marked"

marked.setOptions({
  gfm: true,
})

export interface PostMeta {
  slug: string
  title: string
  summary: string
  publishedAt: string
}

export interface Post extends PostMeta {
  html: string
}

const postsDirectory = path.join(process.cwd(), "content/posts")
const MARKDOWN_EXTENSION = /\.md$/i

const isoFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})

export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post "${slug}" was not found`)
    this.name = "PostNotFoundError"
  }
}

export function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ISO date string "${isoDate}"`)
  }

  return isoFormatter.format(parsed)
}

const loadPostIndex = cache(async (): Promise<PostMeta[]> => {
  const entries = await fs.readdir(postsDirectory, { withFileTypes: true })
  const markdownFiles = entries.filter(
    (entry) => entry.isFile() && MARKDOWN_EXTENSION.test(entry.name),
  )

  const posts = await Promise.all(
    markdownFiles.map(async (entry) => {
      const slug = entry.name.replace(MARKDOWN_EXTENSION, "")
      const file = await fs.readFile(path.join(postsDirectory, entry.name), "utf8")
      const { data } = matter(file)
      return normalizeMeta(slug, data)
    }),
  )

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
})

const loadPost = cache(async (slug: string): Promise<Post> => {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  let file: string

  try {
    file = await fs.readFile(fullPath, "utf8")
  } catch (error) {
    if (isNotFoundError(error)) {
      throw new PostNotFoundError(slug)
    }
    throw error
  }

  const { data, content } = matter(file)
  const meta = normalizeMeta(slug, data)
  const parsed = marked.parse(content)

  if (typeof parsed !== "string") {
    throw new Error(`Failed to render markdown for post "${slug}"`)
  }

  return { ...meta, html: parsed }
})

export async function getAllPosts(): Promise<PostMeta[]> {
  return loadPostIndex()
}

export async function getPost(slug: string): Promise<Post> {
  return loadPost(slug)
}

function normalizeMeta(
  slug: string,
  data: Record<string, unknown>,
): PostMeta {
  const title = data.title
  const summary = data.summary
  const publishedAt = data.publishedAt

  if (
    typeof title !== "string" ||
    typeof summary !== "string" ||
    typeof publishedAt !== "string"
  ) {
    throw new Error(`Post "${slug}" is missing required front matter.`)
  }

  return { slug, title, summary, publishedAt }
}

function isNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false
  }

  if ("code" in error && typeof error.code === "string") {
    return error.code === "ENOENT"
  }

  return false
}
