import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  /**
   * Core user identity table. Stores the primary user profile and metadata.
   * One user can have multiple OAuth accounts linked via the account table.
   * Supports both traditional email/password and OAuth authentication flows.
   */
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
  
  /**
   * Active login sessions for authenticated users.
   * Tracks session lifecycle with expiration and security metadata.
   * Includes roles for session-level permission caching.
   */
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
  
  /**
   * OAuth provider account connections. Enables users to link multiple
   * authentication providers (Google, GitHub, etc.) to a single user identity.
   * Stores provider-specific tokens and credentials for API access.
   */
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
  
  /**
   * Email and phone number verification codes.
   * Temporary records with expiration for secure identity verification flows.
   */
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
  
  /**
   * Two-factor authentication secrets and backup codes.
   * Stores TOTP secrets and one-time backup codes for enhanced security.
   */
  twoFactor: defineTable({
    publicId: v.string(), // tfa_1234567890abcdef - Stripe-style external identifier
    secret: v.string(),
    backupCodes: v.string(),
    userId: v.string(),
  })
    .index('publicId', ['publicId'])
    .index('userId', ['userId']),
  
  /**
   * WebAuthn passkey credentials for passwordless authentication.
   * Stores public keys and metadata for FIDO2/WebAuthn security keys and biometrics.
   */
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
  
  /**
   * OAuth application registrations for third-party app integration.
   * Enables this service to act as an OAuth provider for external applications.
   */
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
  
  /**
   * OAuth access tokens issued to third-party applications.
   * Tracks token lifecycle and permissions for external API access.
   */
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
  
  /**
   * User consent records for OAuth applications.
   * Tracks which permissions users have granted to third-party apps.
   */
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
  
  /**
   * JSON Web Key Set for JWT token signing and verification.
   * Stores public/private key pairs for secure token operations.
   */
  jwks: defineTable({
    publicId: v.string(), // jwk_1234567890abcdef - Stripe-style external identifier
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }).index('publicId', ['publicId']),
  
  /**
   * Rate limiting counters to prevent abuse.
   * Tracks request counts per key (IP, user, etc.) with time windows.
   */
  rateLimit: defineTable({
    publicId: v.string(), // rlt_1234567890abcdef - Stripe-style external identifier
    key: v.optional(v.union(v.null(), v.string())),
    count: v.optional(v.union(v.null(), v.number())),
    lastRequest: v.optional(v.union(v.null(), v.number())),
  })
    .index('publicId', ['publicId'])
    .index('key', ['key']),
  
  /**
   * Alternative rate limiting implementation.
   * Duplicate table - consider consolidating with rateLimit table.
   */
  ratelimit: defineTable({
    publicId: v.string(), // rl2_1234567890abcdef - Stripe-style external identifier
    key: v.string(),
    count: v.number(),
    lastRequest: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('key', ['key']),

  /**
   * Core blog post metadata. Stores canonical identity/SEO fields and points to
   * the currently published revision.
   */
  post: defineTable({
    publicId: v.string(), // pst_1234567890abcdef - external identifier
    slug: v.string(),
    title: v.string(),
    summary: v.optional(v.string()),
    primaryAuthorId: v.id('user'),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    currentPublishedRevisionId: v.optional(v.id('postRevision')),
    featuredMediaId: v.optional(v.id('media')),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index('publicId', ['publicId'])
    .index('slug', ['slug'])
    .index('status', ['status'])
    .index('primaryAuthorId', ['primaryAuthorId'])
    .index('currentPublishedRevisionId', ['currentPublishedRevisionId'])
    .searchIndex('search_posts_title', {
      searchField: 'title',
      filterFields: ['status', 'primaryAuthorId'],
    }),

  /**
   * Immutable snapshot of a post's content at a point in time. Revisions hold
   * editorial history and are promoted to published state through the pipeline.
   */
  postRevision: defineTable({
    publicId: v.string(), // prv_1234567890abcdef
    postId: v.id('post'),
    revisionNumber: v.number(),
    state: v.union(
      v.literal('draft'),
      v.literal('ready'),
      v.literal('published'),
      v.literal('archived')
    ),
    fragmentsChecksum: v.string(),
    source: v.optional(v.union(v.literal('editor'), v.literal('import'), v.literal('api'))),
    createdBy: v.id('user'),
    createdAt: v.number(),
    updatedAt: v.number(),
    note: v.optional(v.string()),
    scheduledPublishAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
  })
    .index('publicId', ['publicId'])
    .index('postId', ['postId'])
    .index('postId_revisionNumber', ['postId', 'revisionNumber'])
    .index('postId_state', ['postId', 'state']),

  /**
   * Ordered fragments of a revision. Each fragment references a typed payload
   * (text, media, component) and drives chunking during artifact generation.
   */
  postFragment: defineTable({
    publicId: v.string(), // pfg_1234567890abcdef
    revisionId: v.id('postRevision'),
    position: v.number(),
    displayPriority: v.union(
      v.literal('intro'),
      v.literal('body'),
      v.literal('supplement')
    ),
    payload: v.union(
      v.object({
        kind: v.literal('text'),
        version: v.literal('1'),
        editorState: v.string(), // Serialized TipTap/MDX JSON string
        wordCount: v.number(),
      }),
      v.object({
        kind: v.literal('image'),
        version: v.literal('1'),
        mediaId: v.id('media'),
        layout: v.union(
          v.literal('inline'),
          v.literal('breakout'),
          v.literal('fullscreen')
        ),
        width: v.number(),
        height: v.number(),
        alt: v.string(),
        caption: v.optional(v.string()),
        focalPoint: v.optional(v.object({ x: v.number(), y: v.number() })),
      }),
      v.object({
        kind: v.literal('video'),
        version: v.literal('1'),
        source: v.union(
          v.object({
            type: v.literal('media'),
            mediaId: v.id('media'),
          }),
          v.object({
            type: v.literal('external'),
            url: v.string(),
          })
        ),
        posterMediaId: v.optional(v.id('media')),
        aspectRatio: v.string(),
        autoplay: v.boolean(),
        loop: v.boolean(),
        controls: v.boolean(),
        caption: v.optional(v.string()),
      }),
      v.object({
        kind: v.literal('component'),
        version: v.literal('1'),
        componentKey: v.string(),
        propsJson: v.string(), // JSON string validated against registry schema
        hydration: v.union(
          v.literal('static'),
          v.literal('client'),
          v.literal('none')
        ),
      }),
      v.object({
        kind: v.literal('webgl'),
        version: v.literal('1'),
        sceneKey: v.string(),
        propsJson: v.string(),
        fallbackMediaId: v.optional(v.id('media')),
        aspectRatio: v.string(),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('revisionId', ['revisionId'])
    .index('revisionId_position', ['revisionId', 'position']),

  /**
   * Join table between fragments and media assets. Enables analytics and GC of
   * unused uploads.
   */
  postFragmentAsset: defineTable({
    publicId: v.string(), // pfa_1234567890abcdef
    fragmentId: v.id('postFragment'),
    mediaId: v.id('media'),
    role: v.union(
      v.literal('primary'),
      v.literal('poster'),
      v.literal('thumbnail')
    ),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('fragmentId', ['fragmentId'])
    .index('mediaId', ['mediaId'])
    .index('fragment_media', ['fragmentId', 'mediaId']),

  /**
   * Record of publish events and artifact locations. References immutable S3
   * artifacts for rollback and cache invalidation.
   */
  postPublication: defineTable({
    publicId: v.string(), // ppu_1234567890abcdef
    postId: v.id('post'),
    revisionId: v.id('postRevision'),
    artifactVersion: v.string(),
    artifactJsonPath: v.string(),
    artifactIntroHtmlPath: v.string(),
    artifactChecksum: v.string(),
    publishedAt: v.number(),
    publishedBy: v.id('user'),
    cdnInvalidationStatus: v.optional(
      v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'))
    ),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId', ['postId'])
    .index('revisionId', ['revisionId'])
    .index('postId_artifactVersion', ['postId', 'artifactVersion'])
    .index('publishedAt', ['publishedAt']),

  /**
   * Controlled vocabulary tags for categorising posts. Replaces freeform tag
   * arrays and enables metadata expansion in the future.
   */
  tag: defineTable({
    publicId: v.string(), // tag_1234567890abcdef
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('slug', ['slug'])
    .index('name', ['name']),

  /**
   * Many-to-many mapping between posts and tags.
   */
  postTag: defineTable({
    publicId: v.string(), // ptg_1234567890abcdef
    postId: v.id('post'),
    tagId: v.id('tag'),
    createdAt: v.number(),
  })
    .index('publicId', ['publicId'])
    .index('postId', ['postId'])
    .index('tagId', ['tagId'])
    .index('postId_tagId', ['postId', 'tagId']),

  /**
   * Media assets for blog posts (images, videos, files).
   * Links to Convex file storage with additional metadata for content management.
   */
  media: defineTable({
    publicId: v.string(), // med_1234567890abcdef - Stripe-style external identifier
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
    .index('publicId', ['publicId'])
    .index('storageId', ['storageId'])
    .index('uploadedBy', ['uploadedBy'])
    .index('mimeType', ['mimeType'])
    .index('isPublic', ['isPublic'])
    .searchIndex('search_media', {
      searchField: 'filename',
      filterFields: ['mimeType', 'uploadedBy', 'tags', 'isPublic']
    }),

})
