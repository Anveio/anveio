import type { PostDefinition } from './definePost'

export type RegisteredPost = {
	readonly definition: PostDefinition
	readonly canonicalSlug: string
	readonly legacySlugs: readonly string[]
}

type CanonicalResolution = {
	readonly kind: 'canonical'
	readonly post: RegisteredPost
}

type LegacyResolution = {
	readonly kind: 'legacy'
	readonly post: RegisteredPost
	readonly matchedSlug: string
}

export type ResolvedPost = CanonicalResolution | LegacyResolution

const registeredPosts: RegisteredPost[] = []
const slugIndex = new Map<string, ResolvedPost>()

export const registerPost = (definition: PostDefinition): PostDefinition => {
	const canonicalSlug = definition.slug

	if (slugIndex.has(canonicalSlug)) {
		throw new Error(
			`Post slug conflict: "${canonicalSlug}" has already been registered.`,
		)
	}

	const entry: RegisteredPost = {
		definition,
		canonicalSlug,
		legacySlugs: definition.legacySlugs,
	}

	registeredPosts.push(entry)
	slugIndex.set(canonicalSlug, { kind: 'canonical', post: entry })

	for (const legacy of entry.legacySlugs) {
		if (slugIndex.has(legacy)) {
			throw new Error(
				`Post slug conflict: legacy slug "${legacy}" has already been registered.`,
			)
		}

		slugIndex.set(legacy, { kind: 'legacy', post: entry, matchedSlug: legacy })
	}

	return definition
}

export const listRegisteredPosts = (): readonly RegisteredPost[] =>
	registeredPosts

export const listCanonicalPosts = (): readonly RegisteredPost[] => registeredPosts

export const listAllKnownSlugs = (): readonly string[] => [
	...slugIndex.keys(),
]

export const resolvePostBySlug = (slug: string): ResolvedPost | null =>
	slugIndex.get(slug) ?? null
