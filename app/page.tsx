import Link from 'next/link'
import { formatListingDate, getAllPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ul className="flex flex-col gap-5">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="flex items-baseline gap-4 text-base leading-relaxed"
          >
            <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {formatListingDate(post.publishedAt)}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="flex-1 text-lg font-semibold text-slate-900 transition hover:text-blue-600"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
