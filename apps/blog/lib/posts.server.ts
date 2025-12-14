import 'server-only'

import { cache } from 'react'

import type { PostMeta } from './posts/definePost'
import { listCanonicalPosts } from './posts/registry'

const isoFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
})

const listingFormatter = new Intl.DateTimeFormat('en-US', {
	year: '2-digit',
	month: '2-digit',
})

export function formatDate(isoDate: string): string {
	const parsed = new Date(isoDate)
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid ISO date string "${isoDate}"`)
	}

	return isoFormatter.format(parsed)
}

export function formatListingDate(isoDate: string): string {
	const parsed = new Date(isoDate)
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid ISO date string "${isoDate}"`)
	}

	return listingFormatter.format(parsed)
}

const loadAllPosts = cache(async () => {
	const posts = Array.from(
		listCanonicalPosts(),
		(entry) => entry.definition.meta,
	)

	posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	)

	return posts
})

export async function getAllPosts() {
	return loadAllPosts()
}

export async function getAdjacentPosts(
	slug: string,
): Promise<{ newer: PostMeta | null; older: PostMeta | null }> {
	const posts = await getAllPosts()
	const index = posts.findIndex((post) => post.slug === slug)

	if (index === -1) {
		return { newer: null, older: null }
	}

	const newer = index > 0 ? posts[index - 1] : null
	const older = index < posts.length - 1 ? posts[index + 1] : null

	return { newer, older }
}
