import { z } from 'zod'

const idSchema = z.string().min(1, 'id must be a non-empty string')

export const fragmentHydrationModeSchema = z.enum([
  'static',
  'client',
  'none',
] as const)

export type FragmentHydrationMode = z.infer<typeof fragmentHydrationModeSchema>

export const textFragmentPayloadSchema = z.object({
  kind: z.literal('text'),
  version: z.literal('1'),
  editorState: z.string().min(1, 'editorState cannot be empty'),
  wordCount: z.number().int().nonnegative(),
})

export const imageFragmentPayloadSchema = z.object({
  kind: z.literal('image'),
  version: z.literal('1'),
  mediaId: idSchema,
  layout: z.enum(['inline', 'breakout', 'fullscreen']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1, 'alt text is required'),
  caption: z.string().optional(),
  focalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
})

export const videoFragmentPayloadSchema = z.object({
  kind: z.literal('video'),
  version: z.literal('1'),
  source: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('media'),
      mediaId: idSchema,
    }),
    z.object({
      type: z.literal('external'),
      url: z.string().url(),
    }),
  ]),
  posterMediaId: idSchema.optional(),
  aspectRatio: z.string().regex(/^\d+:\d+$/, 'aspect ratio must be in W:H format'),
  autoplay: z.boolean(),
  loop: z.boolean(),
  controls: z.boolean(),
  caption: z.string().optional(),
})

export const componentFragmentPayloadSchema = z.object({
  kind: z.literal('component'),
  version: z.literal('1'),
  componentKey: z.string().min(1, 'component key is required'),
  propsJson: z.string().min(2, 'propsJson must be a JSON string'),
  hydration: fragmentHydrationModeSchema,
})

export const webglFragmentPayloadSchema = z.object({
  kind: z.literal('webgl'),
  version: z.literal('1'),
  sceneKey: z.string().min(1, 'scene key is required'),
  propsJson: z.string().min(2, 'propsJson must be a JSON string'),
  fallbackMediaId: idSchema.optional(),
  aspectRatio: z.string().regex(/^\d+:\d+$/, 'aspect ratio must be in W:H format'),
})

export const fragmentPayloadSchema = z.union([
  textFragmentPayloadSchema,
  imageFragmentPayloadSchema,
  videoFragmentPayloadSchema,
  componentFragmentPayloadSchema,
  webglFragmentPayloadSchema,
])

export type FragmentPayload = z.infer<typeof fragmentPayloadSchema>

export const displayPrioritySchema = z.enum(['intro', 'body', 'supplement'])
export type FragmentDisplayPriority = z.infer<typeof displayPrioritySchema>

export const postFragmentSchema = z.object({
  revisionId: idSchema,
  position: z.number().int().nonnegative(),
  displayPriority: displayPrioritySchema,
  payload: fragmentPayloadSchema,
})

export type PostFragmentInput = z.infer<typeof postFragmentSchema>
