import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const accountTables = {
  account: defineTable({
    publicId: v.string(), // acc_1234567890abcdef - Stripe-style external identifier
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    accessToken: v.optional(v.union(v.null(), v.string())),
    refreshToken: v.optional(v.union(v.null(), v.string())),
    idToken: v.optional(v.union(v.null(), v.string())),
    accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    scope: v.optional(v.union(v.null(), v.string())),
    password: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('accountId', ['accountId'])
    .index('accountId_providerId', ['accountId', 'providerId'])
    .index('providerId_userId', ['providerId', 'userId'])
    .index('userId', ['userId']),

  oauthApplication: defineTable({
    publicId: v.string(), // app_1234567890abcdef - Stripe-style external identifier
    name: v.optional(v.union(v.null(), v.string())),
    icon: v.optional(v.union(v.null(), v.string())),
    metadata: v.optional(v.union(v.null(), v.string())),
    clientId: v.optional(v.union(v.null(), v.string())), // cid_1234567890abcdef format
    clientSecret: v.optional(v.union(v.null(), v.string())),
    redirectURLs: v.optional(v.union(v.null(), v.string())),
    type: v.optional(v.union(v.null(), v.string())),
    disabled: v.optional(v.union(v.null(), v.boolean())),
    userId: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  })
    .index('publicId', ['publicId'])
    .index('clientId', ['clientId'])
    .index('userId', ['userId']),

  oauthAccessToken: defineTable({
    publicId: v.string(), // tok_1234567890abcdef - Stripe-style external identifier
    accessToken: v.optional(v.union(v.null(), v.string())),
    refreshToken: v.optional(v.union(v.null(), v.string())),
    accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    clientId: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    scopes: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  })
    .index('publicId', ['publicId'])
    .index('accessToken', ['accessToken'])
    .index('refreshToken', ['refreshToken'])
    .index('clientId', ['clientId'])
    .index('userId', ['userId']),

  oauthConsent: defineTable({
    publicId: v.string(), // con_1234567890abcdef - Stripe-style external identifier
    clientId: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    scopes: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
    consentGiven: v.optional(v.union(v.null(), v.boolean())),
  })
    .index('publicId', ['publicId'])
    .index('clientId_userId', ['clientId', 'userId'])
    .index('userId', ['userId']),

  jwks: defineTable({
    publicId: v.string(), // jwk_1234567890abcdef - Stripe-style external identifier
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }).index('publicId', ['publicId']),

  rateLimit: defineTable({
    publicId: v.string(), // rlt_1234567890abcdef - Stripe-style external identifier
    key: v.optional(v.union(v.null(), v.string())),
    count: v.optional(v.union(v.null(), v.number())),
    lastRequest: v.optional(v.union(v.null(), v.number())),
  })
    .index('publicId', ['publicId'])
    .index('key', ['key']),

  ratelimit: defineTable({
    publicId: v.string(), // rl2_1234567890abcdef - Stripe-style external identifier
    key: v.string(),
    count: v.number(),
    lastRequest: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('key', ['key']),
} as const
