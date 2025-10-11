import type { ComponentType } from 'react'
import { z } from 'zod'
import type { FragmentHydrationMode, FragmentPayload } from '@/lib/post-fragments'
import {
  fragmentHydrationModeSchema,
  fragmentPayloadSchema,
} from '@/lib/post-fragments'

type FragmentComponentModule = {
  default: ComponentType<any>
}

export type FragmentComponentDefinition<
  Schema extends z.ZodTypeAny,
  Hydration extends FragmentHydrationMode = FragmentHydrationMode,
> = {
  key: string
  displayName: string
  hydration: Hydration
  propsSchema: Schema
  load: () => Promise<FragmentComponentModule>
}

const demoPlaceholderPropsSchema = z.object({
  message: z.string().min(1).default('Demo fragment placeholder'),
})

export const fragmentComponents = {
  'demo/placeholder': {
    key: 'demo/placeholder',
    displayName: 'Demo Placeholder',
    hydration: 'client',
    propsSchema: demoPlaceholderPropsSchema,
    load: async () =>
      import(
        '@/components/embeds/DemoPlaceholder'
      ) as Promise<FragmentComponentModule>,
  },
} as const satisfies Record<
  string,
  FragmentComponentDefinition<z.ZodTypeAny, FragmentHydrationMode>
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

export function assertComponentPayload(payload: FragmentPayload) {
  return fragmentPayloadSchema.parse(payload)
}

export function validateHydrationMode(mode: FragmentHydrationMode) {
  return fragmentHydrationModeSchema.parse(mode)
}
