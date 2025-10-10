/** biome-ignore-all assist/source/organizeImports: next.js directive */
import 'server-only'

import { authEnv } from '@/lib/env'
import type { Account, Session, User, Verification } from '@better-auth/core/db'
import { betterAuth } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { hashPassword } from 'better-auth/crypto'
import { nextCookies } from 'better-auth/next-js'
import { randomUUID } from 'node:crypto'

type MemoryDatabase = {
  user: User[]
  account: Account[]
  session: Session[]
  verification: Verification[]
  ratelimit: Record<string, unknown>[]
}

const memoryDb: MemoryDatabase = {
  user: [],
  account: [],
  session: [],
  verification: [],
  ratelimit: [],
}

async function seedAdminUser() {
  const existingUser = memoryDb.user.find(
    (entry: User) => entry.email === authEnv.adminEmail,
  ) as User | undefined

  if (existingUser) {
    const existingCredential = memoryDb.account.find(
      (entry: Account) =>
        entry.userId === existingUser.id &&
        entry.providerId === 'email-password',
    ) as Account | undefined

    if (!existingCredential) {
      const now = new Date()
      const passwordHash = await hashPassword(authEnv.adminPassword)
      const credential: Account = {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        providerId: 'email-password',
        accountId: authEnv.adminEmail,
        userId: existingUser.id,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        password: passwordHash,
      }
      memoryDb.account.push(credential)
    }
    return
  }

  const now = new Date()
  const userId = randomUUID()
  const user: User = {
    id: userId,
    email: authEnv.adminEmail,
    name: authEnv.adminName,
    emailVerified: true,
    image: null,
    createdAt: now,
    updatedAt: now,
  }
  const passwordHash = await hashPassword(authEnv.adminPassword)
  const credential: Account = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    providerId: 'email-password',
    accountId: authEnv.adminEmail,
    userId,
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    password: passwordHash,
  }

  memoryDb.user.push(user)
  memoryDb.account.push(credential)
}

await seedAdminUser()

export const auth = betterAuth({
  baseURL: authEnv.baseURL,
  secret: authEnv.secret,
  database: memoryAdapter(memoryDb),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
    disableSessionRefresh: false,
  },
  rateLimit: {
    enabled: false,
  },
  advanced: {
    useSecureCookies: authEnv.isProduction,
    defaultCookieAttributes: {
      sameSite: 'lax',
      path: '/',
    },
  },
  plugins: [nextCookies()],
})

export type AdminSession = Exclude<
  Awaited<ReturnType<(typeof auth)['api']['getSession']>>,
  null
>
