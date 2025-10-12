import { imagesManifest } from './generated'

type Manifest = typeof imagesManifest

type PostImageData = {
	src: string
	width: number
	height: number
	placeholder: string
	srcSet: string
}

export function getPostImage(postSlug: string, imageKey: string): PostImageData {
	if (!hasOwnProperty(imagesManifest, postSlug)) {
		throw new Error(`No images registered for post "${postSlug}". Run "npm run images".`)
	}

	const postManifest = imagesManifest[postSlug]
	if (!hasOwnProperty(postManifest, imageKey)) {
		throw new Error(
			`Image "${imageKey}" is not registered for post "${postSlug}". Run "npm run images".`,
		)
	}

	const entry = postManifest[imageKey]
	const variants = entry.variants.map((variant) => ({
		width: Number(variant.width),
		height: Number(variant.height),
		url: variant.url,
	}))
	const [firstVariant, ...otherVariants] = variants

	if (!firstVariant) {
		throw new Error(`Image "${imageKey}" for post "${postSlug}" has no generated variants.`)
	}

	const largestVariant = otherVariants.reduce((prev, next) =>
		next.width > prev.width ? next : prev,
		firstVariant,
	)

	const srcSet = variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ')

	return {
		src: largestVariant.url,
		width: largestVariant.width,
		height: largestVariant.height,
		placeholder: entry.placeholder,
		srcSet,
	}
}

function hasOwnProperty<T extends object, K extends PropertyKey>(
	object: T,
	key: K,
): key is K & keyof T {
	return Object.prototype.hasOwnProperty.call(object, key)
}
