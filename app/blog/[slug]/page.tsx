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
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-10 border-b border-slate-200 pb-5 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {post.title}
            </h1>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-500"
            >
              Archive
            </Link>
          </div>
        </header>
        <main className="space-y-12">
          <article
            className="space-y-6 text-lg leading-relaxed text-slate-800 dark:text-slate-100 [&_a]:text-blue-600 [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-2 [&_code]:py-1 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-10 [&_img]:rounded-xl [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-100 [&_pre]:p-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_table]:w-full [&_table]:table-auto [&_th]:border-b [&_th]:border-slate-200 [&_th]:py-2 [&_td]:border-b [&_td]:border-slate-100 [&_td]:py-2 [&_tr:last-child_td]:border-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <nav className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
            {older ? (
              <Link
                href={`/blog/${older.slug}`}
                className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-500"
              >
                <span aria-hidden>←</span>
                <span>{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/blog/${newer.slug}`}
                className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-500"
              >
                <span>{newer.title}</span>
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </main>
        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 italic">
            <Link
              href="/"
              className="font-medium text-blue-600 transition hover:text-blue-500"
            >
              Archive
            </Link>
            <a
              href="mailto:shovon@hey.com"
              className="font-medium text-blue-600 transition hover:text-blue-500"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound()
    }
    throw error
  }
}
