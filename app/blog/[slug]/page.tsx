import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { formatDate, getPost } from "@/lib/posts"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = resolvePost(slug)

  if (!post) {
    return { title: "Post not found · Shovon Hasan" }
  }

  return {
    title: `${post.title} · Shovon Hasan`,
    description: post.summary,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = resolvePost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <article className="post">
        <h1>{post.title}</h1>
        <p className="post-meta">{formatDate(post.publishedAt)}</p>
        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  )
}

function resolvePost(slug: string) {
  try {
    return getPost(slug)
  } catch (error) {
    console.error(`Failed to load post "${slug}":`, error)
    return null
  }
}
