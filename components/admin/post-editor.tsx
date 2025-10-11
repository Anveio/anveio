'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useMutation, useQuery } from 'convex/react'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

import type { FragmentPayload } from '@/convex/schema/postFragments'
import {
  adminBadgeBaseClass,
  adminBadgeVariants,
  adminButtonClass,
  adminCardClass,
  adminFormFieldClass,
  adminInputClass,
  adminLinkButtonClass,
  adminMutedTextClass,
  adminPrimaryButtonClass,
  adminSelectClass,
  adminStackClass,
  adminTextareaClass,
} from '@/components/admin/ui-classes'

interface PostEditorProps {
  readonly postId: string
}

const displayPriorityOptions = [
  { value: 'intro', label: 'Intro' },
  { value: 'body', label: 'Body' },
  { value: 'supplement', label: 'Supplement' },
] as const

const postStatusLabel: Record<Doc<'post'>['status'], string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

const dangerLinkClass =
  'text-sm font-semibold text-rose-600 transition hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:text-rose-200'
const infoBadgeClass =
  `${adminBadgeBaseClass} bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-500/30`
const subtleBadgeClass =
  `${adminBadgeBaseClass} bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-600/40`

type TextPayload = Extract<FragmentPayload, { kind: 'text' }>

type DraftFragment = Doc<'postFragment'> & {
  payload: FragmentPayload
}

type EditorData = {
  post: Doc<'post'>
  draftFragments: DraftFragment[]
  publishHistory: Array<Doc<'postPublication'>>
}

const isTextPayload = (payload: FragmentPayload): payload is TextPayload =>
  payload.kind === 'text'

const computeWordCount = (input: string): number => {
  const trimmed = input.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function buildTextPayload(text: string): TextPayload {
  return {
    kind: 'text',
    version: '1',
    editorState: text,
    wordCount: computeWordCount(text),
  }
}

interface DraftFragmentEditorProps {
  readonly fragment: DraftFragment
  readonly index: number
  readonly total: number
  readonly onSave: (fragment: DraftFragment, payload?: FragmentPayload, displayPriority?: DraftFragment['displayPriority']) => Promise<void>
  readonly onDelete: (fragmentId: Id<'postFragment'>) => Promise<void>
  readonly onMove: (fragmentId: Id<'postFragment'>, direction: 'up' | 'down') => Promise<void>
}

function DraftFragmentEditor({ fragment, index, total, onSave, onDelete, onMove }: DraftFragmentEditorProps) {
  const [text, setText] = useState(() => (isTextPayload(fragment.payload) ? fragment.payload.editorState : ''))
  const [displayPriority, setDisplayPriority] = useState(fragment.displayPriority)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isTextPayload(fragment.payload)) {
      setText(fragment.payload.editorState)
    } else {
      setText('')
    }
    setDisplayPriority(fragment.displayPriority)
  }, [fragment._id, fragment.payload, fragment.displayPriority])

  const canEditText = isTextPayload(fragment.payload)

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      try {
        let nextPayload: FragmentPayload | undefined
        if (canEditText) {
          nextPayload = buildTextPayload(text)
        }
        await onSave(fragment, nextPayload, displayPriority)
      } catch (cause) {
        console.error(cause)
        setError(cause instanceof Error ? cause.message : 'Failed to save fragment')
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(fragment._id)
      } catch (cause) {
        console.error(cause)
        setError(cause instanceof Error ? cause.message : 'Failed to delete fragment')
      }
    })
  }

  const handleMove = (direction: 'up' | 'down') => {
    startTransition(async () => {
      try {
        await onMove(fragment._id, direction)
      } catch (cause) {
        console.error(cause)
        setError(cause instanceof Error ? cause.message : 'Failed to reorder fragment')
      }
    })
  }

  return (
    <article className={`${adminCardClass} space-y-5`}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Fragment {index + 1} of {total}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={adminLinkButtonClass}
            onClick={() => handleMove('up')}
            disabled={isPending || index === 0}
          >
            Move up
          </button>
          <button
            type="button"
            className={adminLinkButtonClass}
            onClick={() => handleMove('down')}
            disabled={isPending || index === total - 1}
          >
            Move down
          </button>
          <button
            type="button"
            className={dangerLinkClass}
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </button>
        </div>
      </header>
      <div className={adminFormFieldClass}>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Display priority
        </label>
        <select
          value={displayPriority}
          onChange={(event) =>
            setDisplayPriority(event.target.value as DraftFragment['displayPriority'])
          }
          disabled={isPending}
          className={adminSelectClass}
        >
          {displayPriorityOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {canEditText ? (
        <div className={adminFormFieldClass}>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Text content
          </label>
          <textarea
            value={text}
            rows={5}
            onChange={(event) => setText(event.target.value)}
            disabled={isPending}
            className={`${adminTextareaClass} min-h-[12rem]`}
          />
        </div>
      ) : (
        <pre className="overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm font-mono leading-relaxed text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
          {JSON.stringify(fragment.payload, null, 2)}
        </pre>
      )}
      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="button"
        className={adminButtonClass}
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? 'Saving…' : 'Save fragment'}
      </button>
    </article>
  )
}

export function PostEditor({ postId }: PostEditorProps) {
  const id = postId as Id<'post'>
  const data = useQuery(api.posts.getPostEditorData, { postId: id }) as EditorData | null | undefined

  const updateMetadata = useMutation(api.posts.updatePostMetadata)
  const addDraftFragment = useMutation(api.posts.addDraftFragment)
  const updateDraftFragment = useMutation(api.posts.updateDraftFragment)
  const deleteDraftFragment = useMutation(api.posts.deleteDraftFragment)
  const reorderDraftFragments = useMutation(api.posts.reorderDraftFragments)
  const publishPost = useMutation(api.posts.publishPost)

  const [metadataState, setMetadataState] = useState({
    title: '',
    slug: '',
    summary: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [metadataPending, startMetadataTransition] = useTransition()
  const [publishPending, startPublishTransition] = useTransition()
  const [newFragmentText, setNewFragmentText] = useState('')
  const [newFragmentPriority, setNewFragmentPriority] = useState<DraftFragment['displayPriority']>('body')

  useEffect(() => {
    if (data && data.post) {
      setMetadataState({
        title: data.post.title,
        slug: data.post.slug,
        summary: data.post.summary ?? '',
      })
    }
  }, [data?.post?._id, data?.post?.title, data?.post?.slug, data?.post?.summary])

  const draftFragments = useMemo(() => data?.draftFragments ?? [], [data?.draftFragments])

  if (data === undefined) {
    return <p>Loading post…</p>
  }

  if (data === null) {
    return <p>Post not found.</p>
  }

  const { post, publishHistory } = data

  const handleMetadataSave = () => {
    setMessage(null)
    startMetadataTransition(async () => {
      try {
        await updateMetadata({
          postId: post._id,
          title: metadataState.title,
          slug: metadataState.slug,
          summary: metadataState.summary || null,
        })
        setMessage('Post metadata saved.')
      } catch (cause) {
        console.error(cause)
        setMessage(cause instanceof Error ? cause.message : 'Failed to save metadata')
      }
    })
  }

  const handleAddFragment = () => {
    setMessage(null)
    const text = newFragmentText.trim()
    if (text.length === 0) {
      setMessage('Add some text before creating a fragment.')
      return
    }

    const payload = buildTextPayload(text)

    addDraftFragment({
      postId: post._id,
      payload,
      displayPriority: newFragmentPriority,
      position: undefined,
    })
      .then(() => {
        setNewFragmentText('')
        setMessage('Fragment added to draft.')
      })
      .catch((cause) => {
        console.error(cause)
        setMessage(cause instanceof Error ? cause.message : 'Failed to add fragment')
      })
  }

  const handleSaveFragment = async (
    fragment: DraftFragment,
    payload?: FragmentPayload,
    displayPriority?: DraftFragment['displayPriority'],
  ) => {
    const updates: Parameters<typeof updateDraftFragment>[0] = {
      fragmentId: fragment._id,
    }
    if (payload) {
      updates.payload = payload
    }
    if (displayPriority && displayPriority !== fragment.displayPriority) {
      updates.displayPriority = displayPriority
    }
    if (updates.payload === undefined && updates.displayPriority === undefined) {
      return
    }
    await updateDraftFragment(updates)
  }

  const handleDeleteFragment = async (fragmentId: Id<'postFragment'>) => {
    await deleteDraftFragment({ fragmentId })
  }

  const handleReorder = async (
    fragmentId: Id<'postFragment'>,
    direction: 'up' | 'down',
  ) => {
    const order = draftFragments.map((fragment) => fragment._id)
    const index = order.indexOf(fragmentId)
    if (index === -1) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= order.length) return
    const nextOrder = order.slice()
    const [moved] = nextOrder.splice(index, 1)
    nextOrder.splice(targetIndex, 0, moved)
    await reorderDraftFragments({ postId: post._id, fragmentOrder: nextOrder })
  }

  const handlePublish = () => {
    setMessage(null)
    startPublishTransition(async () => {
      try {
        await publishPost({ postId: post._id })
        setMessage('Post published successfully.')
      } catch (cause) {
        console.error(cause)
        setMessage(cause instanceof Error ? cause.message : 'Failed to publish post')
      }
    })
  }

  return (
    <div className={`${adminStackClass} pb-12`}>
      <section className={adminCardClass}>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
            <p className={adminMutedTextClass}>Post ID: {post.publicId}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`${adminBadgeBaseClass} ${adminBadgeVariants[post.status]}`}
            >
              {postStatusLabel[post.status]}
            </span>
            <span className={subtleBadgeClass}>
              Created {formatDateTime(post.createdAt)}
            </span>
            {post.publishedAt ? (
              <span className={infoBadgeClass}>
                Last published {formatDateTime(post.publishedAt)}
              </span>
            ) : null}
          </div>
        </header>
        <div className="mt-6 flex flex-col gap-5">
          <div className={adminFormFieldClass}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Title
            </label>
            <input
              type="text"
              value={metadataState.title}
              onChange={(event) =>
                setMetadataState((prev) => ({ ...prev, title: event.target.value }))
              }
              className={adminInputClass}
            />
          </div>
          <div className={adminFormFieldClass}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Slug
            </label>
            <input
              type="text"
              value={metadataState.slug}
              onChange={(event) =>
                setMetadataState((prev) => ({ ...prev, slug: event.target.value }))
              }
              className={adminInputClass}
            />
          </div>
          <div className={adminFormFieldClass}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Summary
            </label>
            <textarea
              rows={3}
              value={metadataState.summary}
              onChange={(event) =>
                setMetadataState((prev) => ({ ...prev, summary: event.target.value }))
              }
              className={`${adminTextareaClass} min-h-[8rem]`}
            />
          </div>
          <button
            type="button"
            className={adminPrimaryButtonClass}
            onClick={handleMetadataSave}
            disabled={metadataPending}
          >
            {metadataPending ? 'Saving…' : 'Save metadata'}
          </button>
        </div>
      </section>

      <section className={adminCardClass}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Draft fragments
          </h2>
          <p className={adminMutedTextClass}>
            {draftFragments.length} fragment{draftFragments.length === 1 ? '' : 's'}
          </p>
        </header>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className={`${adminFormFieldClass} flex-1`}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              New text fragment
            </label>
            <textarea
              rows={3}
              value={newFragmentText}
              onChange={(event) => setNewFragmentText(event.target.value)}
              className={`${adminTextareaClass} min-h-[8rem]`}
            />
          </div>
          <div className={`${adminFormFieldClass} lg:w-56`}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Priority
            </label>
            <select
              value={newFragmentPriority}
              onChange={(event) =>
                setNewFragmentPriority(event.target.value as DraftFragment['displayPriority'])
              }
              className={adminSelectClass}
            >
              {displayPriorityOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className={adminButtonClass} onClick={handleAddFragment}>
            Add fragment
          </button>
        </div>
        {draftFragments.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            No draft fragments yet. Add one using the form above.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            {draftFragments.map((fragment, index) => (
              <DraftFragmentEditor
                key={fragment._id}
                fragment={fragment}
                index={index}
                total={draftFragments.length}
                onSave={handleSaveFragment}
                onDelete={handleDeleteFragment}
                onMove={handleReorder}
              />
            ))}
          </div>
        )}
      </section>

      <section className={adminCardClass}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Publish
          </h2>
        </header>
        {message && (
          <p className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-300">
            {message}
          </p>
        )}
        <button
          type="button"
          className={`${adminPrimaryButtonClass} mt-4 w-full sm:w-auto`}
          onClick={handlePublish}
          disabled={publishPending || draftFragments.length === 0}
        >
          {publishPending ? 'Publishing…' : 'Publish post'}
        </button>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Publish history
          </h3>
          {publishHistory.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No publish events yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {publishHistory.map((entry) => (
                <li key={entry._id}>
                  Published on {formatDateTime(entry.publishedAt)} by {String(entry.publishedBy)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}
