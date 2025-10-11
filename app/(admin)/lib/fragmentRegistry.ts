import type { ComponentType } from 'react'
import { v } from 'convex/values'
import type { GenericValidator, Infer } from 'convex/values'
import type {
  FragmentHydrationMode,
  FragmentPayload,
} from '@/convex/schema/postFragments'

type FragmentComponentModule<Props> = {
  default: ComponentType<Props>
}

export type FragmentComponentDefinition<
  Validator extends GenericValidator,
  Hydration extends FragmentHydrationMode = FragmentHydrationMode,
> = {
  key: string
  displayName: string
  hydration: Hydration
  propsValidator: Validator
  load: () => Promise<FragmentComponentModule<Infer<Validator>>>
}

const demoPlaceholderPropsValidator = v.object({
  message: v.string(),
})

export const fragmentComponents = {
  'demo/placeholder': {
    key: 'demo/placeholder',
    displayName: 'Demo Placeholder',
    hydration: 'client',
    propsValidator: demoPlaceholderPropsValidator,
    load: async () =>
      import('@/components/embeds/DemoPlaceholder') as Promise<
        FragmentComponentModule<Infer<typeof demoPlaceholderPropsValidator>>
      >,
  },
} as const satisfies Record<
  string,
  FragmentComponentDefinition<GenericValidator, FragmentHydrationMode>
>

export type FragmentComponentKey = keyof typeof fragmentComponents

export const fragmentComponentKeys = Object.keys(
  fragmentComponents,
) as FragmentComponentKey[]

export function getFragmentComponentDefinition<
  Key extends FragmentComponentKey,
>(key: Key) {
  return fragmentComponents[key]
}

export function assertComponentPayload(payload: unknown): FragmentPayload {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof (payload as { kind?: unknown }).kind !== 'string'
  ) {
    throw new Error('Invalid fragment payload: missing kind')
  }

  const candidate = payload as Record<string, unknown>
  switch (candidate.kind) {
    case 'text':
      if (typeof candidate.editorState !== 'string') {
        throw new Error('Text fragment requires editorState string')
      }
      return candidate as FragmentPayload
    case 'image':
      if (typeof candidate.mediaId !== 'string') {
        throw new Error('Image fragment requires mediaId')
      }
      return candidate as FragmentPayload
    case 'video':
      if (typeof candidate.source !== 'object' || candidate.source === null) {
        throw new Error('Video fragment requires source')
      }
      return candidate as FragmentPayload
    case 'component':
      if (typeof candidate.componentKey !== 'string') {
        throw new Error('Component fragment requires componentKey')
      }
      validateHydrationMode(candidate.hydration)
      return candidate as FragmentPayload
    case 'webgl':
      if (typeof candidate.sceneKey !== 'string') {
        throw new Error('WebGL fragment requires sceneKey')
      }
      return candidate as FragmentPayload
    default:
      throw new Error(`Unsupported fragment kind: ${String(candidate.kind)}`)
  }
}

const hydrationModes = ['static', 'client', 'none'] as const satisfies readonly FragmentHydrationMode[]

export function validateHydrationMode(
  mode: unknown,
): FragmentHydrationMode {
  if (
    typeof mode === 'string' &&
    hydrationModes.includes(mode as FragmentHydrationMode)
  ) {
    return mode as FragmentHydrationMode
  }
  throw new Error(`Invalid hydration mode: ${String(mode)}`)
}
