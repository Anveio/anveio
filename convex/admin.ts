import { internalMutation, mutation } from './_generated/server'
import { v } from 'convex/values'

import { rolesSchema } from '../lib/auth/roles'

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

export const resetAdminAccount = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const normalizedEmail = normalizeEmail(email)

    const user = await ctx.db
      .query('user')
      .withIndex('email_name', (q) => q.eq('email', normalizedEmail))
      .unique()

    if (!user) {
      return { removed: false }
    }

    const [
      sessions,
      accounts,
      twoFactorEntries,
      passkeys,
      verifications,
    ] = await Promise.all([
      ctx.db
        .query('session')
        .withIndex('userId', (q) => q.eq('userId', user._id))
        .collect(),
      ctx.db
        .query('account')
        .withIndex('userId', (q) => q.eq('userId', user._id))
        .collect(),
      ctx.db
        .query('twoFactor')
        .withIndex('userId', (q) => q.eq('userId', user._id))
        .collect(),
      ctx.db
        .query('passkey')
        .withIndex('userId', (q) => q.eq('userId', user._id))
        .collect(),
      ctx.db.query('verification').collect(),
    ])

    const userIdString = String(user._id)

    for (const session of sessions) {
      await ctx.db.delete(session._id)
    }

    for (const account of accounts) {
      await ctx.db.delete(account._id)
    }

    for (const entry of twoFactorEntries) {
      await ctx.db.delete(entry._id)
    }

    for (const key of passkeys) {
      await ctx.db.delete(key._id)
    }

    for (const verification of verifications) {
      const identifierIncludesEmail =
        typeof verification.identifier === 'string' &&
        verification.identifier.toLowerCase().includes(normalizedEmail)
      const valueMatchesUser =
        typeof verification.value === 'string' &&
        (verification.value === userIdString ||
          verification.value.toLowerCase() === normalizedEmail)

      if (identifierIncludesEmail || valueMatchesUser) {
        await ctx.db.delete(verification._id)
      }
    }

    await ctx.db.delete(user._id)
    return { removed: true }
  },
})

export const applyAdminProfile = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { email, name }) => {
    const normalizedEmail = normalizeEmail(email)
    const user = await ctx.db
      .query('user')
      .withIndex('email_name', (q) => q.eq('email', normalizedEmail))
      .unique()

    if (!user) {
      throw new Error(`Unable to find user with email ${normalizedEmail}`)
    }

    await ctx.db.patch(user._id, {
      name,
      emailVerified: true,
      updatedAt: Date.now(),
    })

    return { userId: user._id }
  },
})

export const syncSessionRoles = internalMutation({
  args: {
    email: v.string(),
    roles: v.array(v.union(v.literal('user'), v.literal('admin'))),
  },
  handler: async (ctx, { email, roles }) => {
    const normalizedEmail = normalizeEmail(email)
    const nextRoles = rolesSchema.parse(roles)

    const user = await ctx.db
      .query('user')
      .withIndex('email_name', (q) => q.eq('email', normalizedEmail))
      .unique()

    if (!user) {
      return { updated: 0 }
    }

    const sessions = await ctx.db
      .query('session')
      .withIndex('userId', (q) => q.eq('userId', user._id))
      .collect()

    for (const session of sessions) {
      await ctx.db.patch(session._id, { roles: nextRoles })
    }

    return { updated: sessions.length }
  },
})

export const ensureRoles = mutation({
  args: {
    email: v.string(),
    roles: v.array(v.union(v.literal('user'), v.literal('admin'))),
  },
  handler: async (ctx, { email, roles }) => {
    const normalizedEmail = normalizeEmail(email)
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
