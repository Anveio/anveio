import type { PostMeta } from './types'

import { postDefinition as languageModelsPost } from '@/app/blog/language-models-can-use-existing-software/post'

const toPostMeta = (meta: {
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly publishedAt: string
}): PostMeta => ({
  slug: meta.slug,
  title: meta.title,
  summary: meta.summary,
  publishedAt: meta.publishedAt,
})

export const codePostsMeta: ReadonlyArray<PostMeta> = [
  toPostMeta(languageModelsPost.meta),
]

export const codePostSlugs = new Set(codePostsMeta.map((post) => post.slug))
