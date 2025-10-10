import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  /**
   * Core user identity table. Stores the primary user profile and metadata.
   * One user can have multiple OAuth accounts linked via the account table.
   * Supports both traditional email/password and OAuth authentication flows.
   */
  user: defineTable({
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
    .index('email_name', ['email', 'name'])
    .index('name', ['name'])
    .index('userId', ['userId'])
    .index('username', ['username'])
    .index('phoneNumber', ['phoneNumber']),
  
  /**
   * Active login sessions for authenticated users.
   * Tracks session lifecycle with expiration and security metadata.
   * Includes roles for session-level permission caching.
   */
  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.union(v.null(), v.string())),
    userAgent: v.optional(v.union(v.null(), v.string())),
    userId: v.string(),
    roles: v.optional(v.array(v.union(v.literal('user'), v.literal('admin')))),
  })
    .index('expiresAt', ['expiresAt'])
    .index('expiresAt_userId', ['expiresAt', 'userId'])
    .index('token', ['token'])
    .index('userId', ['userId']),
  
  /**
   * OAuth provider account connections. Enables users to link multiple
   * authentication providers (Google, GitHub, etc.) to a single user identity.
   * Stores provider-specific tokens and credentials for API access.
   */
  account: defineTable({
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
    .index('accountId', ['accountId'])
    .index('accountId_providerId', ['accountId', 'providerId'])
    .index('providerId_userId', ['providerId', 'userId'])
    .index('userId', ['userId']),
  
  /**
   * Email and phone number verification codes.
   * Temporary records with expiration for secure identity verification flows.
   */
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('expiresAt', ['expiresAt'])
    .index('identifier', ['identifier']),
  
  /**
   * Two-factor authentication secrets and backup codes.
   * Stores TOTP secrets and one-time backup codes for enhanced security.
   */
  twoFactor: defineTable({
    secret: v.string(),
    backupCodes: v.string(),
    userId: v.string(),
  }).index('userId', ['userId']),
  
  /**
   * WebAuthn passkey credentials for passwordless authentication.
   * Stores public keys and metadata for FIDO2/WebAuthn security keys and biometrics.
   */
  passkey: defineTable({
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
    .index('credentialID', ['credentialID'])
    .index('userId', ['userId']),
  
  /**
   * OAuth application registrations for third-party app integration.
   * Enables this service to act as an OAuth provider for external applications.
   */
  oauthApplication: defineTable({
    name: v.optional(v.union(v.null(), v.string())),
    icon: v.optional(v.union(v.null(), v.string())),
    metadata: v.optional(v.union(v.null(), v.string())),
    clientId: v.optional(v.union(v.null(), v.string())),
    clientSecret: v.optional(v.union(v.null(), v.string())),
    redirectURLs: v.optional(v.union(v.null(), v.string())),
    type: v.optional(v.union(v.null(), v.string())),
    disabled: v.optional(v.union(v.null(), v.boolean())),
    userId: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  })
    .index('clientId', ['clientId'])
    .index('userId', ['userId']),
  
  /**
   * OAuth access tokens issued to third-party applications.
   * Tracks token lifecycle and permissions for external API access.
   */
  oauthAccessToken: defineTable({
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
    .index('accessToken', ['accessToken'])
    .index('refreshToken', ['refreshToken'])
    .index('clientId', ['clientId'])
    .index('userId', ['userId']),
  
  /**
   * User consent records for OAuth applications.
   * Tracks which permissions users have granted to third-party apps.
   */
  oauthConsent: defineTable({
    clientId: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    scopes: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
    consentGiven: v.optional(v.union(v.null(), v.boolean())),
  })
    .index('clientId_userId', ['clientId', 'userId'])
    .index('userId', ['userId']),
  
  /**
   * JSON Web Key Set for JWT token signing and verification.
   * Stores public/private key pairs for secure token operations.
   */
  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }),
  
  /**
   * Rate limiting counters to prevent abuse.
   * Tracks request counts per key (IP, user, etc.) with time windows.
   */
  rateLimit: defineTable({
    key: v.optional(v.union(v.null(), v.string())),
    count: v.optional(v.union(v.null(), v.number())),
    lastRequest: v.optional(v.union(v.null(), v.number())),
  }).index('key', ['key']),
  
  /**
   * Alternative rate limiting implementation.
   * Duplicate table - consider consolidating with rateLimit table.
   */
  ratelimit: defineTable({
    key: v.string(),
    count: v.number(),
    lastRequest: v.number(),
  }).index('key', ['key']),

  /**
   * Blog posts with rich content composition.
   * Stores structured content blocks that can include text, images, videos, and components.
   * Uses a flexible block-based architecture for complex layouts.
   */
  post: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.array(v.object({
      id: v.string(),
      type: v.union(
        v.literal('text'),
        v.literal('image'), 
        v.literal('video'),
        v.literal('webgl'),
        v.literal('component')
      ),
      data: v.any(), // Flexible data structure per block type
      metadata: v.optional(v.object({
        caption: v.optional(v.string()),
        alt: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        alignment: v.optional(v.union(v.literal('left'), v.literal('center'), v.literal('right'))),
      })),
    })),
    authorId: v.id('user'),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    publishedAt: v.optional(v.number()),
    tags: v.array(v.string()),
    featuredImageId: v.optional(v.id('_storage')),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('slug', ['slug'])
    .index('authorId', ['authorId'])
    .index('status', ['status'])
    .index('publishedAt', ['publishedAt'])
    .index('authorId_status', ['authorId', 'status'])
    .searchIndex('search_content', {
      searchField: 'title',
      filterFields: ['status', 'authorId', 'tags']
    }),

  /**
   * Media assets for blog posts (images, videos, files).
   * Links to Convex file storage with additional metadata for content management.
   */
  media: defineTable({
    storageId: v.id('_storage'),
    filename: v.string(),
    originalFilename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    uploadedBy: v.id('user'),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('storageId', ['storageId'])
    .index('uploadedBy', ['uploadedBy'])
    .index('mimeType', ['mimeType'])
    .index('isPublic', ['isPublic'])
    .searchIndex('search_media', {
      searchField: 'filename',
      filterFields: ['mimeType', 'uploadedBy', 'tags', 'isPublic']
    }),

  /**
   * Content categories for organizing blog posts.
   * Hierarchical structure supporting nested categories.
   */
  category: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id('category')),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    isVisible: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('slug', ['slug'])
    .index('parentId', ['parentId'])
    .index('isVisible_sortOrder', ['isVisible', 'sortOrder']),

  /**
   * Many-to-many relationship between posts and categories.
   * Enables posts to belong to multiple categories.
   */
  postCategory: defineTable({
    postId: v.id('post'),
    categoryId: v.id('category'),
    createdAt: v.number(),
  })
    .index('postId', ['postId'])
    .index('categoryId', ['categoryId'])
    .index('postId_categoryId', ['postId', 'categoryId']),
})
