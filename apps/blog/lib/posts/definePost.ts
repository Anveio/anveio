import type { Metadata } from 'next'
import type { ReactElement } from 'react'

type StaticOgImage = {
	readonly type: 'static'
	readonly url: string
	readonly alt?: string
}

type DynamicOgImage = {
	readonly type: 'dynamic'
	readonly path: string
	readonly alt?: string
}

export type OgImageSpecifier = StaticOgImage | DynamicOgImage

type PostMetaCore = {
	readonly title: string
	readonly summary: string
	readonly publishedAt: string
	readonly updatedAt?: string
	readonly tags?: readonly string[]
	readonly openGraphImage?: OgImageSpecifier
}

export type PostMetaInput = PostMetaCore & {
	readonly slug?: string
	readonly legacySlugs?: readonly string[]
}

export type PostMeta = PostMetaCore & {
	readonly slug: string
}

export interface PostDefinition {
	readonly slug: string
	readonly legacySlugs: readonly string[]
	readonly meta: PostMeta
	readonly Component: () => ReactElement
	readonly generateMetadata: () => Metadata
}

type OpenGraphImageEntries = Array<{
	readonly url: string
	readonly alt?: string
}>

const resolveOgImages = (
	spec: OgImageSpecifier | undefined,
): OpenGraphImageEntries | undefined => {
	if (!spec) {
		return undefined
	}

	if (spec.type === 'static') {
		return [
			{
				url: spec.url,
				alt: spec.alt,
			},
		]
	}

	return [
		{
			url: spec.path,
			alt: spec.alt,
		},
	]
}

const slugSeparators = /[^a-z0-9]+/g
const trimSeparators = /^-+|-+$/g

const slugify = (value: string): string => {
	const normalised = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
	const collapsed = normalised.replace(slugSeparators, '-').replace(/-{2,}/g, '-')
	const trimmed = collapsed.replace(trimSeparators, '')

	if (!trimmed) {
		throw new Error('Cannot generate slug from an empty value')
	}

	return trimmed
}

const toCanonicalSlug = (provided: string | undefined, title: string): string =>
	provided ? slugify(provided) : slugify(title)

const toLegacySlugs = (
	legacy: readonly string[] | undefined,
	canonical: string,
): readonly string[] => {
	if (!legacy || legacy.length === 0) {
		return []
	}

	const unique = new Set<string>()
	for (const value of legacy) {
		const candidate = slugify(value)
		if (candidate !== canonical) {
			unique.add(candidate)
		}
	}

	return [...unique]
}

/**
 * Helper that co-locates post metadata with the article component and provides
 * consistent metadata generation for Next.js routes, archives, RSS feeds, etc.
 */
export function definePost({
	meta,
	component,
	siteName = 'Shovon Hasan',
}: {
	readonly meta: PostMetaInput
	readonly component: () => ReactElement
	readonly siteName?: string
}): PostDefinition {
	const { slug: providedSlug, legacySlugs: providedLegacySlugs, ...frontMatter } =
		meta

	const slug = toCanonicalSlug(providedSlug, meta.title)
	const legacySlugs = toLegacySlugs(providedLegacySlugs, slug)

	const postMeta: PostMeta = {
		...frontMatter,
		slug,
	}

	const openGraphTags = postMeta.tags ? [...postMeta.tags] : undefined
	const images = resolveOgImages(postMeta.openGraphImage)

	const metadata: Metadata = {
		title: `${postMeta.title} · ${siteName}`,
		description: postMeta.summary,
		openGraph: {
			title: postMeta.title,
			description: postMeta.summary,
			type: 'article',
			publishedTime: postMeta.publishedAt,
			modifiedTime: postMeta.updatedAt,
			tags: openGraphTags,
			images,
		},
		twitter: {
			card: 'summary_large_image',
			title: postMeta.title,
			description: postMeta.summary,
			images: images?.map((image) => image.url),
		},
	}

	return {
		slug,
		legacySlugs,
		meta: postMeta,
		Component: component,
		generateMetadata: () => metadata,
	}
}
