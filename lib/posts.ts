import fs from "node:fs"
import path from "node:path"
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

export function formatDate(isoDate: string): string {
  return isoFormatter.format(new Date(isoDate))
}

export function getAllPosts(): PostMeta[] {
  const entries = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && MARKDOWN_EXTENSION.test(entry.name))

  const posts = entries.map((entry) => {
    const slug = entry.name.replace(MARKDOWN_EXTENSION, "")
    const file = fs.readFileSync(path.join(postsDirectory, entry.name), "utf8")
    const { data } = matter(file)
    return normalizeMeta(slug, data)
  })

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPost(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const file = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(file)
  const meta = normalizeMeta(slug, data)
  const parsed = marked.parse(content)

  if (typeof parsed !== "string") {
    throw new Error(`Failed to render markdown for post "${slug}"`)
  }

  const html = parsed
  return { ...meta, html }
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
