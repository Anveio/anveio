import { requireAdminSession } from '@/lib/admin-session'
import { PostsManager } from '@/components/admin/posts-manager'

export default async function AdminDashboard() {
  const session = await requireAdminSession('/admin')

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PostsManager currentUserEmail={session.user.email} />
    </main>
  )
}
