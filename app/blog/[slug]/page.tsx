import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  PostNotFoundError,
  formatDate,
  getPost,
} from "@/lib/posts"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPost(slug)
    return {
      title: `${post.title} · Shovon Hasan`,
      description: post.summary,
    }
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      return { title: "Post not found · Shovon Hasan" }
    }
    throw error
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  try {
    const { slug } = await params
    const post = await getPost(slug)

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
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound()
    }
    throw error
  }
}
