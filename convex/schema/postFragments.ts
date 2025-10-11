import type { Infer } from 'convex/values'
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

export type FragmentHydrationMode = Infer<typeof fragmentHydrationModeValidator>
export type FragmentStage = Infer<typeof fragmentStageValidator>
export type FragmentDisplayPriority = Infer<typeof displayPriorityValidator>
export type TextFragmentPayload = Infer<typeof textFragmentPayloadValidator>
export type ImageFragmentPayload = Infer<typeof imageFragmentPayloadValidator>
export type VideoFragmentPayload = Infer<typeof videoFragmentPayloadValidator>
export type ComponentFragmentPayload = Infer<
  typeof componentFragmentPayloadValidator
>
export type WebglFragmentPayload = Infer<typeof webglFragmentPayloadValidator>
export type FragmentPayload = Infer<typeof fragmentPayloadValidator>
export type PostFragmentInput = Infer<typeof postFragmentValidator>
