'use client'

import { useMemo, useState, useTransition } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { SignOutButton } from '@/components/admin/sign-out-button'
import {
  adminCardClass,
  adminFormFieldClass,
  adminInputClass,
  adminLinkButtonClass,
  adminMutedTextClass,
  adminPrimaryButtonClass,
  adminStackClass,
  adminTextareaClass,
} from '@/components/admin/ui-classes'

interface PostsManagerProps {
  readonly currentUserEmail: string
}

interface ListPost {
  _id: Id<'post'>
  publicId: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  summary: string | null
  updatedAt: number
  publishedAt: number | null
  createdAt: number
}

const statusLabel: Record<ListPost['status'], string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? '' : 's'}`

const formatDateTime = (timestamp: number | null): string => {
  if (!timestamp) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

const slugify = (input: string): string => {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function PostsManager({ currentUserEmail }: PostsManagerProps) {
  const router = useRouter()
  const posts = useQuery(api.posts.listPosts) as ListPost[] | undefined
  const createPost = useMutation(api.posts.createPost)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const totalStats = useMemo(() => {
    if (!posts) return { total: 0, published: 0 }
    const published = posts.filter((post) => post.status === 'published').length
    return { total: posts.length, published }
  }, [posts])

  const handleCreate = async () => {
    setError(null)
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required to create a post.')
      return
    }

    startTransition(async () => {
      try {
        const slug = slugify(trimmedTitle) || `post-${Date.now()}`
        const result = await createPost({
          title: trimmedTitle,
          slug,
          summary: summary.trim() || undefined,
          featuredMediaId: undefined,
          seoTitle: undefined,
          seoDescription: undefined,
          canonicalUrl: undefined,
        })
        setTitle('')
        setSummary('')
        router.push(`/admin/posts/${result.postId}/edit`)
      } catch (cause) {
        console.error(cause)
        setError(cause instanceof Error ? cause.message : 'Failed to create post')
      }
    })
  }

  return (
    <div className={adminStackClass}>
      <section className={adminCardClass}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Workspace</h1>
            <p className={adminMutedTextClass}>Signed in as {currentUserEmail}</p>
          </div>
          <SignOutButton />
        </header>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/60">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Posts
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {totalStats.total}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/60">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Published
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {totalStats.published}
            </dd>
          </div>
        </dl>
      </section>

      <section className={adminCardClass}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Create a New Post
          </h2>
        </header>
        <div className="mt-4 flex flex-col gap-4">
          <label className={adminFormFieldClass}>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Observability Notes"
              autoComplete="off"
              className={adminInputClass}
            />
          </label>
          <label className={adminFormFieldClass}>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Summary (optional)
            </span>
            <textarea
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="One-paragraph synopsis for listings"
              className={adminTextareaClass}
            />
          </label>
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            className={adminPrimaryButtonClass}
            onClick={handleCreate}
            disabled={isPending}
          >
            {isPending ? 'Creating…' : 'Create & edit'}
          </button>
        </div>
      </section>

      <section className={adminCardClass}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Posts
          </h2>
          <p className={adminMutedTextClass}>
            {posts === undefined
              ? 'Loading…'
              : `${pluralize(posts.length, 'post')} total`}
          </p>
        </header>
        {posts === undefined ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Loading posts…
          </p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            No posts yet. Create your first draft above.
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50/70 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Published
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    aria-label="actions"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="bg-white/90 odd:bg-white even:bg-slate-50/70 dark:bg-slate-900/40 dark:odd:bg-slate-900/60 dark:even:bg-slate-900/40"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {post.title}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-sm text-slate-700 dark:text-slate-200">
                      {statusLabel[post.status]}
                    </td>
                    <td className="px-4 py-3 align-middle text-sm text-slate-700 dark:text-slate-200">
                      {formatDateTime(post.updatedAt)}
                    </td>
                    <td className="px-4 py-3 align-middle text-sm text-slate-700 dark:text-slate-200">
                      {formatDateTime(post.publishedAt)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={adminLinkButtonClass}
                          onClick={() => router.push(`/admin/posts/${post._id}/edit`)}
                        >
                          Edit
                        </button>
                        <a
                          className={adminLinkButtonClass}
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
