'use client'

import { useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'

interface PostEditorProps {
	readonly postId: string
}

type DraftFragment = Doc<'postFragment'>
type FragmentPayload = DraftFragment['payload']

type EditorData = {
	post: Doc<'post'>
	draftFragments: DraftFragment[]
	publishHistory: Array<Doc<'postPublication'>>
}

const displayPriorityOptions = [
	{ value: 'intro', label: 'Intro' },
	{ value: 'body', label: 'Body' },
	{ value: 'supplement', label: 'Supplement' },
] as const

const isTextPayload = (
	payload: FragmentPayload,
): payload is Extract<FragmentPayload, { kind: 'text' }> =>
	payload.kind === 'text'

const formatDateTime = (timestamp: number): string =>
	new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(timestamp))

const buildTextPayload = (
	text: string,
): Extract<FragmentPayload, { kind: 'text' }> => ({
	kind: 'text',
	version: '1',
	editorState: text,
	wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
})

type FragmentUpdateHandler = (
	fragment: DraftFragment,
	payload?: FragmentPayload,
	displayPriority?: DraftFragment['displayPriority'],
) => Promise<void>

type MoveHandler = (
	fragmentId: Id<'postFragment'>,
	direction: 'up' | 'down',
) => Promise<void>

function DraftFragmentEditor({
	fragment,
	index,
	total,
	onSave,
	onDelete,
	onMove,
}: {
	fragment: DraftFragment
	index: number
	total: number
	onSave: FragmentUpdateHandler
	onDelete: (fragmentId: Id<'postFragment'>) => Promise<void>
	onMove: MoveHandler
}) {
	const [text, setText] = useState(() =>
		isTextPayload(fragment.payload) ? fragment.payload.editorState : '',
	)
	const [displayPriority, setDisplayPriority] = useState(
		fragment.displayPriority,
	)
	const [message, setMessage] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

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
		startTransition(async () => {
			try {
				const payload = canEditText ? buildTextPayload(text) : undefined
				await onSave(fragment, payload, displayPriority)
				setMessage('Fragment saved.')
			} catch (cause) {
				console.error(cause)
				setMessage(
					cause instanceof Error ? cause.message : 'Failed to save fragment',
				)
			}
		})
	}

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await onDelete(fragment._id)
				setMessage(null)
			} catch (cause) {
				console.error(cause)
				setMessage(
					cause instanceof Error ? cause.message : 'Failed to delete fragment',
				)
			}
		})
	}

	const handleMove = (direction: 'up' | 'down') => {
		startTransition(async () => {
			try {
				await onMove(fragment._id, direction)
				setMessage(null)
			} catch (cause) {
				console.error(cause)
				setMessage(
					cause instanceof Error ? cause.message : 'Failed to reorder fragment',
				)
			}
		})
	}

	return (
		<article className="rounded-xl border border-slate-200/70 bg-white/95 p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
					Fragment {index + 1}
				</span>
				<div className="flex items-center gap-3 text-sm">
					<button
						type="button"
						onClick={() => handleMove('up')}
						disabled={isPending || index === 0}
						className="text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 dark:hover:text-white"
					>
						Move up
					</button>
					<button
						type="button"
						onClick={() => handleMove('down')}
						disabled={isPending || index === total - 1}
						className="text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 dark:hover:text-white"
					>
						Move down
					</button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isPending}
						className="font-semibold text-red-600 underline-offset-4 transition hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
					>
						Delete
					</button>
				</div>
			</header>

			<div className="mt-4 space-y-4">
				<label className="flex flex-col gap-2 text-sm">
					<span className="font-semibold text-slate-700 dark:text-slate-200">
						Display priority
					</span>
					<select
						value={displayPriority}
						onChange={(event) =>
							setDisplayPriority(
								event.target.value as DraftFragment['displayPriority'],
							)
						}
						disabled={isPending}
						className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
					>
						{displayPriorityOptions.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</label>

				{canEditText ? (
					<label className="flex flex-col gap-2 text-sm">
						<span className="font-semibold text-slate-700 dark:text-slate-200">
							Text content
						</span>
						<textarea
							rows={5}
							value={text}
							onChange={(event) => setText(event.target.value)}
							disabled={isPending}
							className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
						/>
					</label>
				) : (
					<pre className="rounded-lg border border-slate-200 bg-slate-50/90 p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
						{JSON.stringify(fragment.payload, null, 2)}
					</pre>
				)}

				{message && (
					<p className="text-sm text-slate-500 dark:text-slate-400">
						{message}
					</p>
				)}

				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
				>
					{isPending ? 'Saving…' : 'Save fragment'}
				</button>
			</div>
		</article>
	)
}

export function PostEditor({ postId }: PostEditorProps) {
	const id = postId as Id<'post'>
	const data = useQuery(api.posts.getPostEditorData, { postId: id }) as
		| EditorData
		| null
		| undefined

	const updateMetadata = useMutation(api.posts.updatePostMetadata)
	const addDraftFragment = useMutation(api.posts.addDraftFragment)
	const updateDraftFragment = useMutation(api.posts.updateDraftFragment)
	const deleteDraftFragment = useMutation(api.posts.deleteDraftFragment)
	const reorderDraftFragments = useMutation(api.posts.reorderDraftFragments)
	const publishPost = useMutation(api.posts.publishPost)

	const [metadata, setMetadata] = useState({ title: '', slug: '', summary: '' })
	const [feedback, setFeedback] = useState<string | null>(null)
	const [newFragmentText, setNewFragmentText] = useState('')
	const [newFragmentPriority, setNewFragmentPriority] =
		useState<DraftFragment['displayPriority']>('body')
	const [metadataPending, startMetadataTransition] = useTransition()
	const [publishPending, startPublishTransition] = useTransition()

	useEffect(() => {
		if (data?.post) {
			setMetadata({
				title: data.post.title,
				slug: data.post.slug,
				summary: data.post.summary ?? '',
			})
		}
	}, [
		data?.post?._id,
		data?.post?.title,
		data?.post?.slug,
		data?.post?.summary,
	])

	const draftFragments = useMemo(
		() => data?.draftFragments ?? [],
		[data?.draftFragments],
	)

	if (data === undefined) {
		return (
			<p className="text-sm text-slate-500 dark:text-slate-400">
				Loading post…
			</p>
		)
	}

	if (data === null) {
		return (
			<p className="text-sm text-red-600 dark:text-red-400">Post not found.</p>
		)
	}

	const { post, publishHistory } = data

	const handleMetadataSave = () => {
		startMetadataTransition(async () => {
			try {
				await updateMetadata({
					postId: post._id,
					title: metadata.title,
					slug: metadata.slug,
					summary: metadata.summary || null,
				})
				setFeedback('Post metadata saved.')
			} catch (cause) {
				console.error(cause)
				setFeedback(
					cause instanceof Error ? cause.message : 'Failed to save metadata',
				)
			}
		})
	}

	const handleAddFragment = () => {
		const trimmed = newFragmentText.trim()
		if (!trimmed) {
			setFeedback('Add some text before creating a fragment.')
			return
		}

		addDraftFragment({
			postId: post._id,
			payload: buildTextPayload(trimmed),
			displayPriority: newFragmentPriority,
			position: undefined,
		})
			.then(() => {
				setNewFragmentText('')
				setFeedback('Fragment added to draft.')
			})
			.catch((cause) => {
				console.error(cause)
				setFeedback(
					cause instanceof Error ? cause.message : 'Failed to add fragment',
				)
			})
	}

	const handleFragmentSave: FragmentUpdateHandler = async (
		fragment,
		payload,
		displayPriority,
	) => {
		const updates: Parameters<typeof updateDraftFragment>[0] = {
			fragmentId: fragment._id,
		}
		if (payload) updates.payload = payload
		if (displayPriority && displayPriority !== fragment.displayPriority) {
			updates.displayPriority = displayPriority
		}
		if (
			updates.payload === undefined &&
			updates.displayPriority === undefined
		) {
			return
		}
		await updateDraftFragment(updates)
	}

	const handleFragmentDelete = async (fragmentId: Id<'postFragment'>) => {
		await deleteDraftFragment({ fragmentId })
	}

	const handleReorder: MoveHandler = async (fragmentId, direction) => {
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
		startPublishTransition(async () => {
			try {
				await publishPost({ postId: post._id })
				setFeedback('Post published successfully.')
			} catch (cause) {
				console.error(cause)
				setFeedback(
					cause instanceof Error ? cause.message : 'Failed to publish post',
				)
			}
		})
	}

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-8 md:py-12">
			<section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
				<header className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
							Edit post
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Post ID: {post.publicId}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						<span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
							{post.status}
						</span>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
							Created {formatDateTime(post.createdAt)}
						</span>
						{post.publishedAt && (
							<span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
								Published {formatDateTime(post.publishedAt)}
							</span>
						)}
					</div>
				</header>

				<div className="mt-6 grid gap-4">
					<label className="flex flex-col gap-2 text-sm">
						<span className="font-semibold text-slate-700 dark:text-slate-200">
							Title
						</span>
						<input
							type="text"
							value={metadata.title}
							onChange={(event) =>
								setMetadata((prev) => ({ ...prev, title: event.target.value }))
							}
							className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm">
						<span className="font-semibold text-slate-700 dark:text-slate-200">
							Slug
						</span>
						<input
							type="text"
							value={metadata.slug}
							onChange={(event) =>
								setMetadata((prev) => ({ ...prev, slug: event.target.value }))
							}
							className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm">
						<span className="font-semibold text-slate-700 dark:text-slate-200">
							Summary
						</span>
						<textarea
							rows={3}
							value={metadata.summary}
							onChange={(event) =>
								setMetadata((prev) => ({
									...prev,
									summary: event.target.value,
								}))
							}
							className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
						/>
					</label>
					<button
						type="button"
						onClick={handleMetadataSave}
						disabled={metadataPending}
						className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
					>
						{metadataPending ? 'Saving…' : 'Save metadata'}
					</button>
				</div>
			</section>

			<section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
						Draft fragments
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						{draftFragments.length} fragment
						{draftFragments.length === 1 ? '' : 's'}
					</p>
				</header>
				<div className="mt-4 flex flex-col gap-4 md:flex-row">
					<textarea
						rows={3}
						value={newFragmentText}
						onChange={(event) => setNewFragmentText(event.target.value)}
						placeholder="Start drafting…"
						className="min-h-[120px] flex-1 rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
					/>
					<div className="flex w-full flex-col gap-3 md:w-56">
						<label className="flex flex-col gap-2 text-sm">
							<span className="font-semibold text-slate-700 dark:text-slate-200">
								Priority
							</span>
							<select
								value={newFragmentPriority}
								onChange={(event) =>
									setNewFragmentPriority(
										event.target.value as DraftFragment['displayPriority'],
									)
								}
								className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
							>
								{displayPriorityOptions.map(({ value, label }) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</label>
						<button
							type="button"
							onClick={handleAddFragment}
							className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
						>
							Add fragment
						</button>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-4">
					{draftFragments.length === 0 ? (
						<p className="text-sm text-slate-500 dark:text-slate-400">
							No draft fragments yet. Add one using the form above.
						</p>
					) : (
						draftFragments.map((fragment, index) => (
							<DraftFragmentEditor
								key={fragment._id}
								fragment={fragment}
								index={index}
								total={draftFragments.length}
								onSave={handleFragmentSave}
								onDelete={handleFragmentDelete}
								onMove={handleReorder}
							/>
						))
					)}
				</div>
			</section>

			<section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
						Publish
					</h2>
					<button
						type="button"
						onClick={handlePublish}
						disabled={publishPending || draftFragments.length === 0}
						className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{publishPending ? 'Publishing…' : 'Publish post'}
					</button>
				</header>
				{feedback && (
					<p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
						{feedback}
					</p>
				)}
				<div className="mt-6">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
									Published on {formatDateTime(entry.publishedAt)} by{' '}
									{String(entry.publishedBy)}
								</li>
							))}
						</ul>
					)}
				</div>
			</section>
		</div>
	)
}
