import { mutation, query } from './_generated/server'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { v } from 'convex/values'
import { isAdmin } from '../lib/auth/roles'
import type { Doc, Id } from './_generated/dataModel'
import {
  displayPriorityValidator,
  fragmentPayloadValidator,
} from './schema/content'

const PUBLIC_ID_LENGTH = 16

const PUBLIC_ID_PREFIX = {
  post: 'pst',
  fragment: 'pfg',
  fragmentAsset: 'pfa',
  publication: 'ppu',
} as const

type FragmentPayload = Doc<'postFragment'>['payload']
type FragmentStage = Doc<'postFragment'>['stage']

const draftStage: FragmentStage = 'draft'
const publishedStage: FragmentStage = 'published'

function createPublicId(prefix: string): string {
  const random = crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, PUBLIC_ID_LENGTH)
  return `${prefix}_${random}`
}

type ConvexCtx = MutationCtx | QueryCtx

async function requireAdmin(ctx: ConvexCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Authentication required')
  }

  const subject = identity.subject
  if (!subject) {
    throw new Error('Session missing subject')
  }

  const user = await ctx.db.get(subject as Id<'user'>)
  if (!user) {
    throw new Error('User not found')
  }

  if (!isAdmin(user)) {
    throw new Error('Admin role required')
  }
  return { identity, user }
}

function extractMediaIds(payload: FragmentPayload): Array<Id<'media'>> {
  const ids = new Set<Id<'media'>>()

  switch (payload.kind) {
    case 'image':
      ids.add(payload.mediaId)
      break
    case 'video':
      if (payload.source.type === 'media') {
        ids.add(payload.source.mediaId)
      }
      if (payload.posterMediaId) {
        ids.add(payload.posterMediaId)
      }
      break
    case 'webgl':
      if (payload.fallbackMediaId) {
        ids.add(payload.fallbackMediaId)
      }
      break
    case 'component':
    case 'text':
      break
    default: {
      const _exhaustiveCheck: never = payload
      return _exhaustiveCheck
    }
  }

  return Array.from(ids)
}

async function replaceFragmentAssets(
  ctx: MutationCtx,
  fragmentId: Id<'postFragment'>,
  postId: Id<'post'>,
  stage: FragmentStage,
  mediaIds: Array<Id<'media'>>,
  now: number,
) {
  const existingAssets = (await ctx.db
    .query('postFragmentAsset')
    .withIndex('fragmentId', (q) => q.eq('fragmentId', fragmentId))
    .collect()) as Array<Doc<'postFragmentAsset'>>

  await Promise.all(existingAssets.map((asset) => ctx.db.delete(asset._id)))

  for (const mediaId of mediaIds) {
    await ctx.db.insert('postFragmentAsset', {
      publicId: createPublicId(PUBLIC_ID_PREFIX.fragmentAsset),
      postId,
      stage,
      fragmentId,
      mediaId,
      role: 'primary',
      createdAt: now,
    })
  }
}

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const posts = (await ctx.db.query('post').collect()) as Array<Doc<'post'>>
    posts.sort((a, b) => b.updatedAt - a.updatedAt)

    return posts.map((post) => ({
      _id: post._id,
      publicId: post.publicId,
      slug: post.slug,
      title: post.title,
      status: post.status,
      summary: post.summary ?? null,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt ?? null,
      createdAt: post.createdAt,
    }))
  },
})

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    summary: v.optional(v.string()),
    featuredMediaId: v.optional(v.id('media')),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx)

    const normalizedSlug = args.slug.trim()
    if (!normalizedSlug) {
      throw new Error('Slug cannot be empty')
    }

    const existingSlug = await ctx.db
      .query('post')
      .withIndex('slug', (q) => q.eq('slug', normalizedSlug))
      .unique()

    if (existingSlug) {
      throw new Error(`Slug "${normalizedSlug}" is already in use`)
    }

    const now = Date.now()

    const postId = await ctx.db.insert('post', {
      publicId: createPublicId(PUBLIC_ID_PREFIX.post),
      slug: normalizedSlug,
      title: args.title,
      summary: args.summary,
      primaryAuthorId: user._id,
      status: 'draft',
      featuredMediaId: args.featuredMediaId,
      seoTitle: args.seoTitle,
      seoDescription: args.seoDescription,
      canonicalUrl: args.canonicalUrl,
      createdAt: now,
      updatedAt: now,
      publishedAt: undefined,
      scheduledPublishAt: undefined,
    })

    return { postId }
  },
})

export const updatePostMetadata = mutation({
  args: {
    postId: v.id('post'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.union(v.string(), v.null())),
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('published'),
        v.literal('archived'),
      ),
    ),
    featuredMediaId: v.optional(v.union(v.id('media'), v.null())),
    seoTitle: v.optional(v.union(v.string(), v.null())),
    seoDescription: v.optional(v.union(v.string(), v.null())),
    canonicalUrl: v.optional(v.union(v.string(), v.null())),
    scheduledPublishAt: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error('Post not found')
    }

    const patch: Record<string, unknown> = {}

    if (args.title !== undefined) patch.title = args.title
    if (args.slug !== undefined) {
      const normalizedSlug = args.slug.trim()
      if (!normalizedSlug) {
        throw new Error('Slug cannot be empty')
      }
      if (normalizedSlug !== post.slug) {
        const existingSlug = await ctx.db
          .query('post')
          .withIndex('slug', (q) => q.eq('slug', normalizedSlug))
          .unique()
        if (existingSlug && existingSlug._id !== post._id) {
          throw new Error(`Slug "${normalizedSlug}" is already in use`)
        }
      }
      patch.slug = normalizedSlug
    }
    if (args.summary !== undefined) patch.summary = args.summary ?? undefined
    if (args.status !== undefined) patch.status = args.status
    if (args.featuredMediaId !== undefined)
      patch.featuredMediaId = args.featuredMediaId ?? undefined
    if (args.seoTitle !== undefined) patch.seoTitle = args.seoTitle ?? undefined
    if (args.seoDescription !== undefined)
      patch.seoDescription = args.seoDescription ?? undefined
    if (args.canonicalUrl !== undefined)
      patch.canonicalUrl = args.canonicalUrl ?? undefined
    if (args.scheduledPublishAt !== undefined) {
      patch.scheduledPublishAt = args.scheduledPublishAt ?? undefined
    }

    patch.updatedAt = Date.now()

    await ctx.db.patch(post._id, patch)
    return { postId: post._id }
  },
})

export const getDraftFragments = query({
  args: {
    postId: v.id('post'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const fragments = (await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', args.postId).eq('stage', draftStage),
      )
      .collect()) as Array<Doc<'postFragment'>>

    fragments.sort((a, b) => a.position - b.position)
    return fragments
  },
})

export const getPostEditorData = query({
  args: {
    postId: v.id('post'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const post = (await ctx.db.get(args.postId)) as Doc<'post'> | null
    if (!post) {
      return null
    }

    const draftFragments = (await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', args.postId).eq('stage', draftStage),
      )
      .collect()) as Array<Doc<'postFragment'>>

    draftFragments.sort((a, b) => a.position - b.position)

    const publishHistory = (await ctx.db
      .query('postPublication')
      .withIndex('postId', (q) => q.eq('postId', args.postId))
      .collect()) as Array<Doc<'postPublication'>>

    publishHistory.sort((a, b) => b.publishedAt - a.publishedAt)

    return {
      post,
      draftFragments,
      publishHistory,
    }
  },
})

export const addDraftFragment = mutation({
  args: {
    postId: v.id('post'),
    payload: fragmentPayloadValidator,
    displayPriority: displayPriorityValidator,
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error('Post not found')
    }

    const now = Date.now()

    const draftFragments = await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', args.postId).eq('stage', draftStage),
      )
      .collect()

    const targetPosition =
      args.position !== undefined
        ? Math.max(0, Math.min(args.position, draftFragments.length))
        : draftFragments.length

    const fragmentsToShift = draftFragments
      .filter((fragment) => fragment.position >= targetPosition)
      .sort((a, b) => b.position - a.position)

    for (const fragment of fragmentsToShift) {
      await ctx.db.patch(fragment._id, {
        position: fragment.position + 1,
        updatedAt: now,
      })
    }

    const fragmentId = await ctx.db.insert('postFragment', {
      publicId: createPublicId(PUBLIC_ID_PREFIX.fragment),
      postId: args.postId,
      stage: draftStage,
      position: targetPosition,
      displayPriority: args.displayPriority,
      payload: args.payload,
      createdAt: now,
      updatedAt: now,
    })

    const mediaIds = extractMediaIds(args.payload)
    if (mediaIds.length > 0) {
      await replaceFragmentAssets(
        ctx,
        fragmentId,
        args.postId,
        draftStage,
        mediaIds,
        now,
      )
    }

    await ctx.db.patch(post._id, { updatedAt: now })

    return { fragmentId }
  },
})

export const updateDraftFragment = mutation({
  args: {
    fragmentId: v.id('postFragment'),
    payload: v.optional(fragmentPayloadValidator),
    displayPriority: v.optional(displayPriorityValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const fragment = await ctx.db.get(args.fragmentId)
    if (!fragment) {
      throw new Error('Fragment not found')
    }
    if (fragment.stage !== draftStage) {
      throw new Error('Only draft fragments can be updated')
    }

    const post = await ctx.db.get(fragment.postId)
    if (!post) {
      throw new Error('Parent post not found')
    }

    if (args.payload === undefined && args.displayPriority === undefined) {
      throw new Error('No updates provided')
    }

    const patch: Record<string, unknown> = {}
    const now = Date.now()
    if (args.payload !== undefined) {
      patch.payload = args.payload
    }
    if (args.displayPriority !== undefined) {
      patch.displayPriority = args.displayPriority
    }
    patch.updatedAt = now

    await ctx.db.patch(fragment._id, patch)

    if (args.payload !== undefined) {
      await replaceFragmentAssets(
        ctx,
        fragment._id,
        fragment.postId,
        draftStage,
        extractMediaIds(args.payload),
        now,
      )
    }

    await ctx.db.patch(post._id, { updatedAt: now })
    return { fragmentId: fragment._id }
  },
})

export const reorderDraftFragments = mutation({
  args: {
    postId: v.id('post'),
    fragmentOrder: v.array(v.id('postFragment')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const fragments = await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', args.postId).eq('stage', draftStage),
      )
      .collect()

    const fragmentMap = new Map(
      fragments.map((fragment) => [fragment._id, fragment]),
    )
    if (fragmentMap.size !== args.fragmentOrder.length) {
      throw new Error('Fragment order must include all draft fragments')
    }

    for (const fragmentId of args.fragmentOrder) {
      if (!fragmentMap.has(fragmentId)) {
        throw new Error('Fragment order contains unknown fragment')
      }
    }

    const now = Date.now()
    await Promise.all(
      args.fragmentOrder.map((fragmentId, index) => {
        const fragment = fragmentMap.get(fragmentId)!
        if (fragment.position === index) {
          return Promise.resolve()
        }
        return ctx.db.patch(fragment._id, { position: index, updatedAt: now })
      }),
    )

    const post = await ctx.db.get(args.postId)
    if (post) {
      await ctx.db.patch(post._id, { updatedAt: now })
    }

    return { postId: args.postId }
  },
})

export const deleteDraftFragment = mutation({
  args: {
    fragmentId: v.id('postFragment'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const fragment = await ctx.db.get(args.fragmentId)
    if (!fragment) {
      throw new Error('Fragment not found')
    }
    if (fragment.stage !== draftStage) {
      throw new Error('Only draft fragments can be deleted')
    }

    const post = await ctx.db.get(fragment.postId)
    if (!post) {
      throw new Error('Parent post not found')
    }

    const now = Date.now()

    await ctx.db.delete(fragment._id)

    const siblingFragments = await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', fragment.postId).eq('stage', draftStage),
      )
      .collect()

    const fragmentsToShift = siblingFragments
      .filter((candidate) => candidate.position > fragment.position)
      .sort((a, b) => a.position - b.position)

    for (const candidate of fragmentsToShift) {
      await ctx.db.patch(candidate._id, {
        position: candidate.position - 1,
        updatedAt: now,
      })
    }

    const assets = await ctx.db
      .query('postFragmentAsset')
      .withIndex('fragmentId', (q) => q.eq('fragmentId', fragment._id))
      .collect()

    await Promise.all(assets.map((asset) => ctx.db.delete(asset._id)))

    await ctx.db.patch(post._id, { updatedAt: now })
    return { postId: fragment.postId }
  },
})

export const publishPost = mutation({
  args: {
    postId: v.id('post'),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx)

    const post = (await ctx.db.get(args.postId)) as Doc<'post'> | null
    if (!post) {
      throw new Error('Post not found')
    }

    const now = Date.now()

    const draftFragments = (await ctx.db
      .query('postFragment')
      .withIndex('postId_stage_position', (q) =>
        q.eq('postId', args.postId).eq('stage', draftStage),
      )
      .collect()) as Array<Doc<'postFragment'>>

    const publishedFragments = (await ctx.db
      .query('postFragment')
      .withIndex('postId_stage', (q) =>
        q.eq('postId', args.postId).eq('stage', publishedStage),
      )
      .collect()) as Array<Doc<'postFragment'>>

    const publishedAssets = (await ctx.db
      .query('postFragmentAsset')
      .withIndex('postId_stage', (q) =>
        q.eq('postId', args.postId).eq('stage', publishedStage),
      )
      .collect()) as Array<Doc<'postFragmentAsset'>>

    for (const asset of publishedAssets) {
      await ctx.db.delete(asset._id)
    }

    for (const fragment of publishedFragments) {
      await ctx.db.delete(fragment._id)
    }

    draftFragments.sort((a, b) => a.position - b.position)

    for (const fragment of draftFragments) {
      const newFragmentId = await ctx.db.insert('postFragment', {
        publicId: createPublicId(PUBLIC_ID_PREFIX.fragment),
        postId: args.postId,
        stage: publishedStage,
        position: fragment.position,
        displayPriority: fragment.displayPriority,
        payload: fragment.payload,
        createdAt: now,
        updatedAt: now,
      })

      await replaceFragmentAssets(
        ctx,
        newFragmentId,
        args.postId,
        publishedStage,
        extractMediaIds(fragment.payload),
        now,
      )
    }

    await ctx.db.patch(post._id, {
      status: 'published',
      updatedAt: now,
      publishedAt: now,
      scheduledPublishAt: undefined,
    })

    await ctx.db.insert('postPublication', {
      publicId: createPublicId(PUBLIC_ID_PREFIX.publication),
      postId: args.postId,
      publishedAt: now,
      publishedBy: user._id,
      createdAt: now,
    })

    return { postId: args.postId, publishedAt: now }
  },
})

export const listPublishHistory = query({
  args: {
    postId: v.id('post'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const history = (await ctx.db
      .query('postPublication')
      .withIndex('postId', (q) => q.eq('postId', args.postId))
      .collect()) as Array<Doc<'postPublication'>>

    history.sort((a, b) => b.publishedAt - a.publishedAt)
    return history
  },
})
