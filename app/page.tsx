import Link from "next/link"
import { formatListingDate, getAllPosts } from "@/lib/posts"

export const dynamic = "force-dynamic"

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <main>
      <ul className="index-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <span className="index-date">{formatListingDate(post.publishedAt)}</span>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
