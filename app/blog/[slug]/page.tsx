import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import {
	listAllKnownSlugs,
	resolvePostBySlug,
} from '@/lib/posts/registry'

export const dynamicParams = false

export const generateStaticParams = () =>
	listAllKnownSlugs().map((slug) => ({ slug }))

type BlogPostPageParams = {
	readonly slug: string
}

type BlogPostPageProps = {
	readonly params: Promise<BlogPostPageParams>
}

export const generateMetadata = async ({
	params,
}: BlogPostPageProps): Promise<Metadata> => {
	const { slug } = await params
	const resolved = resolvePostBySlug(slug)

	if (!resolved) {
		notFound()
	}

	if (resolved.kind === 'legacy') {
		permanentRedirect(`/blog/${resolved.post.canonicalSlug}`)
	}

	return resolved.post.definition.generateMetadata()
}

export default async function BlogPostPage({
	params,
}: BlogPostPageProps) {
	const { slug } = await params
	const resolved = resolvePostBySlug(slug)

	if (!resolved) {
		notFound()
	}

	if (resolved.kind === 'legacy') {
		permanentRedirect(`/blog/${resolved.post.canonicalSlug}`)
	}

	const PostComponent = resolved.post.definition.Component
	return <PostComponent />
}
