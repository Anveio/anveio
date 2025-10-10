import { z } from 'zod'

const envSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string({ message: 'BETTER_AUTH_SECRET is required' })
    .min(1, 'BETTER_AUTH_SECRET must be non-empty'),
  ADMIN_EMAIL: z.email('ADMIN_EMAIL must be a valid email address'),
  ADMIN_PASSWORD: z
    .string({ message: 'ADMIN_PASSWORD is required' })
    .min(
      8,
      'ADMIN_PASSWORD should be at least 8 characters long for basic security',
    ),
  ADMIN_NAME: z.string().min(1).optional().or(z.literal('')),
  CONVEX_AUTH_SECRET: z
    .string({ message: 'CONVEX_AUTH_SECRET is required' })
    .min(32, 'CONVEX_AUTH_SECRET must be at least 32 characters long'),
  RESEND_API_KEY: z
    .string({ message: 'RESEND_API_KEY is required' })
    .min(1, 'RESEND_API_KEY must be non-empty'),
})

const parsed = envSchema.safeParse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
  CONVEX_AUTH_SECRET: process.env.CONVEX_AUTH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
})

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `• ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    `Missing or invalid environment configuration for server-side variables:\n${formatted}`,
  )
}

const data = parsed.data
const normalizedAdminName = data.ADMIN_NAME?.trim() ?? ''

export const SecretEnvironmentVariables = {
  secret: data.BETTER_AUTH_SECRET,
  adminEmail: data.ADMIN_EMAIL,
  adminPassword: data.ADMIN_PASSWORD,
  adminName:
    normalizedAdminName.length > 0 ? normalizedAdminName : 'Site Admin',
  convexAuthSecret: data.CONVEX_AUTH_SECRET,
  resendApiKey: data.RESEND_API_KEY,
}
