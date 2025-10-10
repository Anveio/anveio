import Link from "next/link"
import { requireAdminSession } from "@/lib/admin-session"
import { getAllPosts } from "@/lib/posts"
import { SignOutButton } from "@/components/admin/sign-out-button"

export default async function AdminDashboard() {
  const session = await requireAdminSession("/admin")
  const posts = await getAllPosts()

  return (
    <main>
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Signed in as {session.user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <section>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Drafts created here will appear once we ship the composer.</p>
        ) : (
          <ul className="admin-post-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <span>{post.title}</span>
                <div className="admin-post-actions">
                  <Link href={`/blog/${post.slug}`} prefetch={false}>
                    View
                  </Link>
                  <button type="button" disabled>
                    Edit (coming soon)
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Composer</h2>
        <p>
          The browser-based editor is the next milestone. We’ll add rich text, image uploads, and
          Convex-backed drafts here soon.
        </p>
        <button type="button" disabled>
          Launch Composer (coming soon)
        </button>
      </section>
    </main>
  )
}
