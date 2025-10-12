import { describe, expect, it } from 'vitest'

import { definePost } from '@/lib/posts/definePost'

describe('definePost', () => {
	it('returns a stable post definition with static OG image metadata', () => {
		const meta = {
			slug: 'hello-world',
			title: 'Hello World',
			summary: 'A warm introduction.',
			publishedAt: '2024-01-01T00:00:00Z',
			openGraphImage: {
				type: 'static' as const,
				url: 'https://cdn.example.com/og/hello-world.png',
				alt: 'Stylised hello world graphic.',
			},
		}

		const post = definePost({
			meta,
			component: () => <div>Hello</div>,
			siteName: 'Example Site',
		})

		expect(post.slug).toBe(meta.slug)
		expect(post.meta).toStrictEqual(meta)

		const metadata = post.generateMetadata()
		expect(metadata.title).toBe('Hello World · Example Site')
		expect(metadata.description).toBe(meta.summary)
		expect(metadata.openGraph?.images).toEqual([
			{ url: meta.openGraphImage.url, alt: meta.openGraphImage.alt },
		])
		expect(metadata.twitter?.images).toEqual([meta.openGraphImage.url])
	})

	it('supports dynamic OG image routes and preserves tags', () => {
		const meta = {
			slug: 'dynamic-illustration',
			title: 'Dynamic Illustration',
			summary: 'Rendered on demand.',
			publishedAt: '2024-03-14T13:10:00Z',
			updatedAt: '2024-03-15T10:00:00Z',
			tags: ['dynamic', 'og'],
			openGraphImage: {
				type: 'dynamic' as const,
				path: '/api/og/dynamic-illustration',
			},
		}

		const post = definePost({
			meta,
			component: () => <section>Dynamic</section>,
		})

		const metadata = post.generateMetadata()
		expect(metadata.openGraph?.images).toEqual([
			{ url: meta.openGraphImage.path, alt: undefined },
		])
		expect(metadata.twitter?.images).toEqual([meta.openGraphImage.path])
		if (metadata.openGraph && 'tags' in metadata.openGraph) {
			expect(metadata.openGraph.tags).toEqual(meta.tags)
		} else {
			throw new Error(
				'Expected openGraph.tags to be present for article metadata',
			)
		}
		if (metadata.openGraph && 'modifiedTime' in metadata.openGraph) {
			expect(metadata.openGraph.modifiedTime).toBe(meta.updatedAt)
		} else {
			throw new Error(
				'Expected openGraph.modifiedTime to be present for article metadata',
			)
		}
	})
})
