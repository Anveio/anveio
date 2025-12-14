import { z } from 'zod'

const envSchema = z.object({
  AUTH_BASE_URL: z
    .url('AUTH_BASE_URL must be an absolute URL with protocol')
    .optional()
    .or(z.literal('')),
  NEXT_PUBLIC_CONVEX_SITE_URL: z.url(
    'NEXT_PUBLIC_CONVEX_SITE_URL must be a valid Convex deployment URL',
  ),
  NEXT_PUBLIC_CONVEX_URL: z.url(
    'NEXT_PUBLIC_CONVEX_URL must be a valid Convex deployment URL',
  ),
})

const parsed = envSchema.safeParse({
  AUTH_BASE_URL: process.env.AUTH_BASE_URL,
  NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
})

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `• ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    `Missing or invalid environment configuration for client-side variables:\n${formatted}`,
  )
}

const data = parsed.data

const normalizedAuthBaseUrl = data.AUTH_BASE_URL?.trim() ?? ''
const baseUrl =
  normalizedAuthBaseUrl.length > 0
    ? normalizedAuthBaseUrl
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

export const PublicEnvironmentVariables = {
  convexUrl: data.NEXT_PUBLIC_CONVEX_URL,
  convexSiteUrl: data.NEXT_PUBLIC_CONVEX_SITE_URL,
  baseUrl,
}
