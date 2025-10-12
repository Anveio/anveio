import { convexTest } from 'convex-test'
import { describe, expect, it } from 'vitest'

import { api } from './_generated/api'
import schema from './schema'

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_NAME = 'Site Admin'
const INITIAL_ROLES = ['user'] as const
const ADMIN_ROLES = ['user', 'admin'] as const

describe('admin.ensureRoles', () => {
  it('promotes a user to admin and is idempotent', async () => {
    const t = convexTest(schema)

    const insertedUserId = await t.run(async (ctx) => {
      const now = Date.now()
      return ctx.db.insert('user', {
        publicId: 'usr_test_admin_seed',
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        roles: [...INITIAL_ROLES],
        createdAt: now,
        updatedAt: now,
      })
    })

    const firstResult = await t.mutation(api.admin.ensureRoles, {
      email: ADMIN_EMAIL,
      roles: [...ADMIN_ROLES],
    })

    expect(firstResult).toStrictEqual({ updated: true })

    const promotedUser = await t.run((ctx) => ctx.db.get(insertedUserId))

    expect(promotedUser?.roles).toStrictEqual([...ADMIN_ROLES])

    const secondResult = await t.mutation(api.admin.ensureRoles, {
      email: ADMIN_EMAIL,
      roles: [...ADMIN_ROLES],
    })

    expect(secondResult).toStrictEqual({ updated: false })
  })
})
