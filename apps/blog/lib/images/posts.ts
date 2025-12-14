import { imagesManifest } from './generated'

type ImagesManifest = typeof imagesManifest
type PostSlug = keyof ImagesManifest

type PostImageData = {
	src: string
	width: number
	height: number
	placeholder: string
	srcSet: string
}

export function getPostImage(
	postSlug: string,
	imageKey: string,
): PostImageData {
	assertPostSlug(imagesManifest, postSlug)
	assertImageKey(imagesManifest, postSlug, imageKey)

	const entry = imagesManifest[postSlug][imageKey]
	const variants = entry.variants.map((variant) => ({
		width: Number(variant.width),
		height: Number(variant.height),
		url: variant.url,
	}))
	const [firstVariant, ...otherVariants] = variants

	if (!firstVariant) {
		throw new Error(
			`Image "${imageKey}" for post "${postSlug}" has no generated variants.`,
		)
	}

	const largestVariant = otherVariants.reduce(
		(prev, next) => (next.width > prev.width ? next : prev),
		firstVariant,
	)

	const srcSet = variants
		.map((variant) => `${variant.url} ${variant.width}w`)
		.join(', ')

	return {
		src: largestVariant.url,
		width: largestVariant.width,
		height: largestVariant.height,
		placeholder: entry.placeholder,
		srcSet,
	}
}

function assertPostSlug(
	manifest: ImagesManifest,
	slug: string,
): asserts slug is PostSlug {
	if (!Object.hasOwn(manifest, slug)) {
		throw new Error(
			`No images registered for post "${slug}". Run "npm run images".`,
		)
	}
}

function assertImageKey<S extends PostSlug>(
	manifest: ImagesManifest,
	slug: S,
	key: PropertyKey,
): asserts key is keyof ImagesManifest[S] {
	if (!Object.hasOwn(manifest[slug], key)) {
		throw new Error(
			`Image "${String(key)}" is not registered for post "${slug}". Run "npm run images".`,
		)
	}
}
