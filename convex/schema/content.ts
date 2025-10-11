import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const fragmentHydrationModeValidator = v.union(
  v.literal('static'),
  v.literal('client'),
  v.literal('none'),
)

export const fragmentStageValidator = v.union(
  v.literal('draft'),
  v.literal('published'),
)

export const displayPriorityValidator = v.union(
  v.literal('intro'),
  v.literal('body'),
  v.literal('supplement'),
)

export const textFragmentPayloadValidator = v.object({
  kind: v.literal('text'),
  version: v.literal('1'),
  editorState: v.string(),
  wordCount: v.number(),
})

export const imageFragmentPayloadValidator = v.object({
  kind: v.literal('image'),
  version: v.literal('1'),
  mediaId: v.id('media'),
  layout: v.union(
    v.literal('inline'),
    v.literal('breakout'),
    v.literal('fullscreen'),
  ),
  width: v.number(),
  height: v.number(),
  alt: v.string(),
  caption: v.optional(v.string()),
  focalPoint: v.optional(
    v.object({
      x: v.number(),
      y: v.number(),
    }),
  ),
})

export const videoFragmentPayloadValidator = v.object({
  kind: v.literal('video'),
  version: v.literal('1'),
  source: v.union(
    v.object({
      type: v.literal('media'),
      mediaId: v.id('media'),
    }),
    v.object({
      type: v.literal('external'),
      url: v.string(),
    }),
  ),
  posterMediaId: v.optional(v.id('media')),
  aspectRatio: v.string(),
  autoplay: v.boolean(),
  loop: v.boolean(),
  controls: v.boolean(),
  caption: v.optional(v.string()),
})

export const componentFragmentPayloadValidator = v.object({
  kind: v.literal('component'),
  version: v.literal('1'),
  componentKey: v.string(),
  propsJson: v.string(),
  hydration: fragmentHydrationModeValidator,
})

export const webglFragmentPayloadValidator = v.object({
  kind: v.literal('webgl'),
  version: v.literal('1'),
  sceneKey: v.string(),
  propsJson: v.string(),
  fallbackMediaId: v.optional(v.id('media')),
  aspectRatio: v.string(),
})

export const fragmentPayloadValidator = v.union(
  textFragmentPayloadValidator,
  imageFragmentPayloadValidator,
  videoFragmentPayloadValidator,
  componentFragmentPayloadValidator,
  webglFragmentPayloadValidator,
)

export const postFragmentValidator = v.object({
  postId: v.id('post'),
  stage: fragmentStageValidator,
  position: v.number(),
  displayPriority: displayPriorityValidator,
  payload: fragmentPayloadValidator,
  version: v.number(),
})

export const contentTables = {
  post: defineTable({
    publicId: v.string(), // pst_1234567890abcdef - external identifier
    slug: v.string(),
    title: v.string(),
    summary: v.optional(v.string()),
    primaryAuthorId: v.id('user'),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('archived'),
    ),
    featuredMediaId: v.optional(v.id('media')),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    scheduledPublishAt: v.optional(v.number()),
  })
    .index('publicId', ['publicId'])
    .index('slug', ['slug'])
    .index('status', ['status'])
    .index('primaryAuthorId', ['primaryAuthorId'])
    .index('publishedAt', ['publishedAt'])
    .searchIndex('search_posts_title', {
      searchField: 'title',
      filterFields: ['status', 'primaryAuthorId'],
    }),

  postFragment: defineTable({
    publicId: v.string(), // pfg_1234567890abcdef
    postId: v.id('post'),
    stage: fragmentStageValidator,
    position: v.number(),
    displayPriority: displayPriorityValidator,
    payload: fragmentPayloadValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId_stage', ['postId', 'stage'])
    .index('postId_stage_position', ['postId', 'stage', 'position']),

  postFragmentAsset: defineTable({
    publicId: v.string(), // pfa_1234567890abcdef
    postId: v.id('post'),
    stage: fragmentStageValidator,
    fragmentId: v.id('postFragment'),
    mediaId: v.id('media'),
    role: v.union(
      v.literal('primary'),
      v.literal('poster'),
      v.literal('thumbnail'),
    ),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId_stage', ['postId', 'stage'])
    .index('fragmentId', ['fragmentId'])
    .index('mediaId', ['mediaId'])
    .index('fragment_media', ['fragmentId', 'mediaId']),

  postPublication: defineTable({
    publicId: v.string(), // ppu_1234567890abcdef
    postId: v.id('post'),
    publishedAt: v.number(),
    publishedBy: v.id('user'),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId', ['postId'])
    .index('publishedAt', ['publishedAt']),

  tag: defineTable({
    publicId: v.string(), // tag_1234567890abcdef
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('slug', ['slug'])
    .index('name', ['name']),

  postTag: defineTable({
    publicId: v.string(), // ptg_1234567890abcdef
    postId: v.id('post'),
    tagId: v.id('tag'),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId', ['postId'])
    .index('tagId', ['tagId'])
    .index('postId_tagId', ['postId', 'tagId']),

  media: defineTable({
    publicId: v.string(), // med_1234567890abcdef - Stripe-style external identifier
    storageId: v.id('_storage'),
    filename: v.string(),
    originalFilename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    uploadedBy: v.id('user'),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('storageId', ['storageId'])
    .index('uploadedBy', ['uploadedBy'])
    .index('mimeType', ['mimeType'])
    .index('isPublic', ['isPublic'])
    .searchIndex('search_media', {
      searchField: 'filename',
      filterFields: ['mimeType', 'uploadedBy', 'tags', 'isPublic'],
    }),
} as const
