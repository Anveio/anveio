import { requireAdminSession } from '@/lib/admin-session'
import { PostEditor } from '@/components/admin/post-editor'

interface PostEditorPageProps {
  params: Promise<{ postId: string }>
}

export default async function PostEditorPage({ params }: PostEditorPageProps) {
  const { postId } = await params
  await requireAdminSession(`/admin/posts/${postId}/edit`)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PostEditor postId={postId} />
    </main>
  )
}
