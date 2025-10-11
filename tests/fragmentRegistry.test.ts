import { describe, expect, it } from 'vitest'
import {
  fragmentComponentKeys,
  fragmentComponents,
  getFragmentComponentDefinition,
} from '@/app/(admin)/lib/fragmentRegistry'
import { fragmentHydrationModeSchema } from '@/lib/post-fragments'

describe('fragment registry', () => {
  it('exposes consistent definitions for each key', () => {
    const uniqueKeys = new Set<string>()

    for (const key of fragmentComponentKeys) {
      const definition = getFragmentComponentDefinition(key)
      expect(definition.key).toBe(key)
      expect(fragmentHydrationModeSchema.parse(definition.hydration)).toBe(
        definition.hydration,
      )

      const parsedProps = definition.propsSchema.parse({})
      expect(parsedProps).toBeDefined()

      uniqueKeys.add(definition.key)
    }

    expect(uniqueKeys.size).toBe(fragmentComponentKeys.length)
  })

  it('loads component modules dynamically', async () => {
    for (const definition of Object.values(fragmentComponents)) {
      const mod = await definition.load()
      expect(mod.default).toBeTypeOf('function')
    }
  })
})
