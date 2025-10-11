import { describe, expect, it } from 'vitest'
import {
  assertComponentPayload,
  fragmentComponentKeys,
  fragmentComponents,
  getFragmentComponentDefinition,
  validateHydrationMode,
} from '@/lib/admin/fragmentRegistry'
import type { Doc } from '@/convex/_generated/dataModel'

type FragmentPayload = Doc<'postFragment'>['payload']

describe('fragment registry', () => {
  it('exposes consistent definitions for each key', () => {
    const uniqueKeys = new Set<string>()

    for (const key of fragmentComponentKeys) {
      const definition = getFragmentComponentDefinition(key)
      expect(definition.key).toBe(key)
      expect(definition.propsValidator.isConvexValidator).toBe(true)
      expect(definition.propsValidator.kind).toBe('object')

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

  it('validates hydration modes and fragment payloads', () => {
    expect(validateHydrationMode('client')).toBe('client')
    expect(() => validateHydrationMode('invalid')).toThrow()

    const textPayload: FragmentPayload = {
      kind: 'text',
      version: '1',
      editorState: '{}',
      wordCount: 0,
    }

    expect(assertComponentPayload(textPayload)).toStrictEqual(textPayload)
    expect(() => assertComponentPayload({})).toThrow()
  })
})
