import { mutation } from './_generated/server'
import { v } from 'convex/values'

import { rolesSchema } from '../lib/auth/roles'

export const ensureRoles = mutation({
  args: {
    email: v.string(),
    roles: v.array(v.union(v.literal('user'), v.literal('admin'))),
  },
  handler: async (ctx, { email, roles }) => {
    const normalizedEmail = email.toLowerCase()
    const nextRoles = rolesSchema.parse(roles)

    const user = await ctx.db
      .query('user')
      .withIndex('email_name', (q) => q.eq('email', normalizedEmail))
      .unique()

    if (!user) {
      throw new Error(`Unable to find user with email ${normalizedEmail}`)
    }

    if (
      user.roles &&
      user.roles.length === nextRoles.length &&
      user.roles.every((role, idx) => role === nextRoles[idx])
    ) {
      return { updated: false }
    }

    await ctx.db.patch(user._id, { roles: nextRoles })
    return { updated: true }
  },
})
