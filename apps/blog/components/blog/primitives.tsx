import type { PropsWithChildren, ReactElement } from 'react'

import { getPostImage } from '@/lib/images/posts'

const publishedFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
})

export const Article = ({ children }: PropsWithChildren): ReactElement => (
	<article className="prose prose-slate max-w-none dark:prose-invert">
		{children}
	</article>
)

type SectionComponent = (props: PropsWithChildren) => ReactElement
type SectionHeaderComponent = (props: PropsWithChildren) => ReactElement

const SectionBase: SectionComponent = ({ children }) => (
	<section className="space-y-6">{children}</section>
)

const SectionHeader: SectionHeaderComponent = ({ children }) => (
	<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
		{children}
	</h2>
)

export const Section: SectionComponent & {
	Header: SectionHeaderComponent
} = Object.assign(SectionBase, { Header: SectionHeader })

export type BlogHeroImage = {
	readonly key: string
	readonly alt?: string
	readonly caption?: string
	readonly sizes?: string
	readonly className?: string
}

type BlogHeaderProps = {
	readonly postSlug: string
	readonly title: string
	readonly summary: string
	readonly publishedAt: string
	readonly hero?: BlogHeroImage
}

export const BlogHeader = ({
	postSlug,
	title,
	summary,
	publishedAt,
	hero,
}: BlogHeaderProps): ReactElement => {
	const formattedDate = publishedFormatter.format(new Date(publishedAt))

	return (
		<header className="space-y-4">
			<p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
				Published {formattedDate}
			</p>
			<h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
				{title}
			</h1>
			<p className="text-center text-base text-slate-600 dark:text-slate-300">
				{summary}
			</p>
			{hero ? (
				<div className="mx-auto w-full">
					<ResponsiveImage
						postSlug={postSlug}
						imageKey={hero.key}
						alt={hero.alt ?? summary}
						sizes={hero.sizes ?? '(min-width: 1024px) 768px, 100vw'}
						className={hero.className ?? 'mx-auto rounded-2xl'}
					/>
				</div>
			) : null}
			{hero?.caption ? (
				<p className="text-center text-sm italic text-slate-500 dark:text-slate-400">
					{hero.caption}
				</p>
			) : null}
		</header>
	)
}

type ResponsiveImageProps = {
	readonly postSlug: string
	readonly imageKey: string
	readonly alt: string
	readonly sizes?: string
	readonly className?: string
	readonly loading?: 'lazy' | 'eager'
}

export const ResponsiveImage = ({
	postSlug,
	imageKey,
	alt,
	sizes,
	className,
	loading = 'lazy',
}: ResponsiveImageProps): ReactElement => {
	const data = getPostImage(postSlug, imageKey)
	const resolvedSizes = sizes ?? '100vw'
	const baseClassName = 'h-auto w-full max-w-full'
	const mergedClassName = className
		? `${baseClassName} ${className}`
		: baseClassName

	return (
		<picture>
			<source srcSet={data.srcSet} type="image/webp" sizes={resolvedSizes} />
			<img
				src={data.src}
				alt={alt}
				width={data.width}
				height={data.height}
				sizes={resolvedSizes}
				srcSet={data.srcSet}
				className={mergedClassName}
				loading={loading}
				decoding="async"
				style={{
					backgroundImage: `url(${data.placeholder})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
		</picture>
	)
}

type ImageWithCaptionProps = {
	readonly postSlug: string
	readonly imageKey: string
	readonly caption: string
	readonly alt?: string
	readonly sizes?: string
	readonly figureClassName?: string
	readonly imageClassName?: string
}

export const ImageWithCaption = ({
	postSlug,
	imageKey,
	caption,
	alt,
	sizes = '(min-width: 768px) 640px, 100vw',
	figureClassName,
	imageClassName,
}: ImageWithCaptionProps): ReactElement => (
	<figure className={figureClassName ?? 'my-10 space-y-4 text-center'}>
		<ResponsiveImage
			postSlug={postSlug}
			imageKey={imageKey}
			alt={alt ?? caption}
			sizes={sizes}
			className={imageClassName ?? 'mx-auto rounded-xl'}
		/>
		<figcaption className="text-sm italic text-slate-500 dark:text-slate-400">
			{caption}
		</figcaption>
	</figure>
)
