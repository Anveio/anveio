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

export interface PostMeta {
	readonly slug: string
	readonly title: string
	readonly summary: string
	readonly publishedAt: string
	readonly updatedAt?: string
	readonly tags?: readonly string[]
	readonly openGraphImage?: OgImageSpecifier
}

export interface PostDefinition {
	readonly slug: string
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

/**
 * Helper that co-locates post metadata with the article component and provides
 * consistent metadata generation for Next.js routes, archives, RSS feeds, etc.
 */
export function definePost({
	meta,
	component,
	siteName = 'Shovon Hasan',
}: {
	readonly meta: PostMeta
	readonly component: () => ReactElement
	readonly siteName?: string
}): PostDefinition {
	const openGraphTags = meta.tags ? [...meta.tags] : undefined
	const images = resolveOgImages(meta.openGraphImage)

	const metadata: Metadata = {
		title: `${meta.title} · ${siteName}`,
		description: meta.summary,
		openGraph: {
			title: meta.title,
			description: meta.summary,
			type: 'article',
			publishedTime: meta.publishedAt,
			modifiedTime: meta.updatedAt,
			tags: openGraphTags,
			images,
		},
		twitter: {
			card: 'summary_large_image',
			title: meta.title,
			description: meta.summary,
			images: images?.map((image) => image.url),
		},
	}

	return {
		slug: meta.slug,
		meta,
		Component: component,
		generateMetadata: () => metadata,
	}
}
