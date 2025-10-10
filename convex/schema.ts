import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('suspended'), v.literal('deleted')),
    lastLoginAttempt: v.optional(v.number()),
    failedLoginAttempts: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_email', ['email']),
  accounts: defineTable({
    providerId: v.string(),
    accountId: v.string(),
    userId: v.id('users'),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_provider_account', ['providerId', 'accountId'])
    .index('by_user', ['userId'])
    .index('by_user_provider', ['userId', 'providerId']),
  sessions: defineTable({
    token: v.string(),
    userId: v.id('users'),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_token', ['token'])
    .index('by_user', ['userId'])
    .index('by_expiresAt', ['expiresAt'])
    .index('by_user_expires', ['userId', 'expiresAt']),
  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_identifier', ['identifier'])
    .index('by_expiresAt', ['expiresAt']),
})
