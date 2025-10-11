import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const userTables = {
  user: defineTable({
    publicId: v.string(), // usr_1234567890abcdef - Stripe-style external identifier
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    roles: v.array(v.union(v.literal('user'), v.literal('admin'))),
    image: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    twoFactorEnabled: v.optional(v.union(v.null(), v.boolean())),
    isAnonymous: v.optional(v.union(v.null(), v.boolean())),
    username: v.optional(v.union(v.null(), v.string())),
    displayUsername: v.optional(v.union(v.null(), v.string())),
    phoneNumber: v.optional(v.union(v.null(), v.string())),
    phoneNumberVerified: v.optional(v.union(v.null(), v.boolean())),
    userId: v.optional(v.union(v.null(), v.string())),
  })
    .index('publicId', ['publicId'])
    .index('email_name', ['email', 'name'])
    .index('name', ['name'])
    .index('userId', ['userId'])
    .index('username', ['username'])
    .index('phoneNumber', ['phoneNumber']),
} as const
