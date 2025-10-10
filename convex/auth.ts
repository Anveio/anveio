import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { createFieldAttribute } from 'better-auth/db'
import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import { query } from './_generated/server'
import {
  DEFAULT_ROLES,
  ROLES,
  type Roles,
  rolesSchema,
} from '@/lib/auth/roles'
// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth)

const userRolesField = createFieldAttribute(Array.from(ROLES), {
  required: true,
  input: false,
  defaultValue: () => [...DEFAULT_ROLES],
  validator: {
    input: rolesSchema,
    output: rolesSchema,
  },
})

const sessionRolesField = createFieldAttribute(Array.from(ROLES), {
  required: true,
  input: false,
  defaultValue: () => [...DEFAULT_ROLES],
  validator: {
    input: rolesSchema,
    output: rolesSchema,
  },
})

const coerceRoles = (value: unknown): Roles | null => {
  const parsed = rolesSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

const fallbackRoles = (): Roles => [...DEFAULT_ROLES]

const resolveBaseUrl = (): string => {
  const explicit = process.env.AUTH_BASE_URL?.trim()
  if (explicit) {
    return explicit
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: resolveBaseUrl(),
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    user: {
      additionalFields: {
        roles: userRolesField,
      },
    },
    session: {
      additionalFields: {
        roles: sessionRolesField,
      },
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session, context) => {
            const existing = coerceRoles(
              (session as Record<string, unknown> & { roles?: unknown }).roles,
            )
            if (existing) {
              return { data: { roles: existing } }
            }

            const adapter = context?.context.adapter
            if (!adapter) {
              return { data: { roles: fallbackRoles() } }
            }

            const user = (await adapter.findOne({
              model: 'user',
              where: [
                {
                  field: 'id',
                  value: session.userId,
                },
              ],
            })) as { roles?: unknown } | null

            const derived = coerceRoles(user?.roles) ?? fallbackRoles()
            return { data: { roles: derived } }
          },
        },
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  })
}

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
