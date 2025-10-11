import { internalAction } from './_generated/server'
import { api, internal } from './_generated/api'

import type { Id } from './_generated/dataModel'

import { z } from 'zod'

const envSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD must be provided'),
  ADMIN_NAME: z.string().min(1).optional(),
  CONVEX_SITE_URL: z
    .string()
    .url('CONVEX_SITE_URL must be an absolute URL'),
})

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

const parseEnvironment = () => {
  const result = envSchema.safeParse({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
  })

  if (!result.success) {
    const reasons = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ')
    throw new Error(
      `Missing or invalid environment configuration for admin seeding: ${reasons}`,
    )
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, CONVEX_SITE_URL } =
    result.data
  return {
    email: normalizeEmail(ADMIN_EMAIL),
    password: ADMIN_PASSWORD,
    name: (ADMIN_NAME ?? 'Site Admin').trim() || 'Site Admin',
    siteUrl: CONVEX_SITE_URL.replace(/\/+$/, ''),
  }
}

const ADMIN_ROLES = ['user', 'admin'] as const

type SeedAdminResult =
  | { status: 'disabled' }
  | {
      status: 'ok'
      email: string
      removedExistingAccount: boolean
      userId: Id<'user'>
      signupUserId: string | null
      rolesUpdated: boolean
      sessionsUpdated: number
    }

export const seedAdmin = internalAction({
  args: {},
  handler: async (ctx): Promise<SeedAdminResult> => {
    if (process.env.NODE_ENV === 'production') {
      return { status: 'disabled' as const }
    }

    const env = parseEnvironment()

    const { removed: removedExistingAccount } = await ctx.runMutation(
      internal.admin.resetAdminAccount,
      { email: env.email },
    )

    const response = await fetch(`${env.siteUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: env.email,
        password: env.password,
        name: env.name,
        rememberMe: true,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Failed to seed admin via sign-up endpoint (status ${response.status}): ${errorBody}`,
      )
    }

    const signupPayload: {
      user?: { id?: string; email?: string }
      token?: string | null
    } = await response.json().catch(() => ({}))

    const { userId } = await ctx.runMutation(internal.admin.applyAdminProfile, {
      email: env.email,
      name: env.name,
    })

    const adminRoles = Array.from(ADMIN_ROLES)

    const { updated: rolesUpdated } = await ctx.runMutation(
      api.admin.ensureRoles,
      {
        email: env.email,
        roles: adminRoles,
      },
    )

    const { updated: sessionsUpdated } = await ctx.runMutation(
      internal.admin.syncSessionRoles,
      { email: env.email, roles: adminRoles },
    )

    return {
      status: 'ok' as const,
      email: env.email,
      removedExistingAccount,
      userId,
      signupUserId: signupPayload.user?.id ?? null,
      rolesUpdated,
      sessionsUpdated,
    }
  },
})
