import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const sessionTables = {
  session: defineTable({
    publicId: v.string(), // ses_1234567890abcdef - Stripe-style external identifier
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.union(v.null(), v.string())),
    userAgent: v.optional(v.union(v.null(), v.string())),
    userId: v.string(),
    roles: v.optional(v.array(v.union(v.literal('user'), v.literal('admin')))),
  })
    .index('publicId', ['publicId'])
    .index('expiresAt', ['expiresAt'])
    .index('expiresAt_userId', ['expiresAt', 'userId'])
    .index('token', ['token'])
    .index('userId', ['userId']),

  verification: defineTable({
    publicId: v.string(), // ver_1234567890abcdef - Stripe-style external identifier
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('expiresAt', ['expiresAt'])
    .index('identifier', ['identifier']),

  twoFactor: defineTable({
    publicId: v.string(), // tfa_1234567890abcdef - Stripe-style external identifier
    secret: v.string(),
    backupCodes: v.string(),
    userId: v.string(),
  })
    .index('publicId', ['publicId'])
    .index('userId', ['userId']),

  passkey: defineTable({
    publicId: v.string(), // key_1234567890abcdef - Stripe-style external identifier
    name: v.optional(v.union(v.null(), v.string())),
    publicKey: v.string(),
    userId: v.string(),
    credentialID: v.string(),
    counter: v.number(),
    deviceType: v.string(),
    backedUp: v.boolean(),
    transports: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    aaguid: v.optional(v.union(v.null(), v.string())),
  })
    .index('publicId', ['publicId'])
    .index('credentialID', ['credentialID'])
    .index('userId', ['userId']),
} as const
