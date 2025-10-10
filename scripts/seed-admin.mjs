#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

import { ConvexHttpClient } from 'convex/browser'

import { api } from '../convex/_generated/api.js'

const loadEnvFile = (filename = '.env.local') => {
  const envPath = resolve(process.cwd(), filename)
  if (!existsSync(envPath)) {
    return
  }
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (!match) continue
    const key = match[1].trim()
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const invariant = (value, message) => {
  if (!value) {
    throw new Error(message)
  }
  return value
}

const main = async () => {
  loadEnvFile()

  const baseUrl =
    process.env.AUTH_BASE_URL?.trim() ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ??
    process.env.CONVEX_URL ??
    process.env.CONVEX_SITE_URL

  invariant(convexUrl, 'Missing NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL) in environment')

  const adminKey = invariant(
    process.env.CONVEX_AUTH_SECRET,
    'Missing CONVEX_AUTH_SECRET in environment',
  )

  const email = process.env.SEED_ADMIN_EMAIL?.trim() ?? 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD?.trim() ?? 'password123!'
  const name = process.env.SEED_ADMIN_NAME?.trim() ?? 'Local Admin'

  console.log(`Seeding admin "${email}" against ${baseUrl}`)

  const signupResponse = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      rememberMe: true,
    }),
  })

  if (signupResponse.ok) {
    console.log('• Created auth account')
  } else if (signupResponse.status === 409) {
    console.log('• Auth account already exists, continuing')
  } else {
    const detail = await signupResponse.text()
    throw new Error(
      `Failed to sign up admin user (${signupResponse.status}): ${detail || signupResponse.statusText}`,
    )
  }

  const convex = new ConvexHttpClient(convexUrl)
  convex.setAdminAuth(adminKey)

  const result = await convex.mutation(api.admin.ensureRoles, {
    email,
    roles: ['user', 'admin'],
  })

  if (result?.updated) {
    console.log('• Updated roles to ["user","admin"]')
  } else {
    console.log('• Roles already set')
  }

  console.log('✅ Admin seed complete')
}

main().catch((error) => {
  console.error('❌ Failed to seed admin')
  console.error(error)
  process.exitCode = 1
})
