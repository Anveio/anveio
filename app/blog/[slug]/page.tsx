import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  PostNotFoundError,
  getAdjacentPosts,
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
    const { newer, older } = await getAdjacentPosts(slug)

    return (
      <>
        <header className="post-header">
          <strong>{post.title}</strong> | <Link href="/">Archive</Link>
          <hr />
        </header>
        <main>
          <article
            className="post"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </main>
        <nav>
          <div className="np">
            {older ? (
              <Link href={`/blog/${older.slug}`}>← {older.title}</Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={`/blog/${newer.slug}`}>{newer.title} →</Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
        <footer>
          <div className="np">
            <Link href="/">Archive</Link>
            <a href="mailto:shovon@hey.com">Email</a>
          </div>
        </footer>
      </>
    )
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound()
    }
    throw error
  }
}
