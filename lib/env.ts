import { z } from "zod"

const envSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string({ message: "BETTER_AUTH_SECRET is required" })
    .min(1, "BETTER_AUTH_SECRET must be non-empty"),
  ADMIN_EMAIL: z.email("ADMIN_EMAIL must be a valid email address"),
  ADMIN_PASSWORD: z
    .string({ message: "ADMIN_PASSWORD is required" })
    .min(8, "ADMIN_PASSWORD should be at least 8 characters long for basic security"),
  ADMIN_NAME: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("")),
  AUTH_BASE_URL: z
    .url("AUTH_BASE_URL must be an absolute URL with protocol")
    .optional()
    .or(z.literal("")),
  CONVEX_URL: z.url("CONVEX_URL must be a valid Convex deployment URL"),
  CONVEX_AUTH_SECRET: z
    .string({ message: "CONVEX_AUTH_SECRET is required" })
    .min(32, "CONVEX_AUTH_SECRET must be at least 32 characters long"),
})

const parsed = envSchema.safeParse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
  AUTH_BASE_URL: process.env.AUTH_BASE_URL,
  CONVEX_URL: process.env.CONVEX_URL,
  CONVEX_AUTH_SECRET: process.env.CONVEX_AUTH_SECRET,
})

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `• ${issue.path.join(".")}: ${issue.message}`)
    .join("\n")
  throw new Error(
    `Missing or invalid environment configuration for better-auth integration:\n${formatted}`,
  )
}

const data = parsed.data

const baseUrl =
  data.AUTH_BASE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")

export const authEnv = {
  secret: data.BETTER_AUTH_SECRET,
  adminEmail: data.ADMIN_EMAIL,
  adminPassword: data.ADMIN_PASSWORD,
  adminName: data.ADMIN_NAME ?? "Site Admin",
  baseURL: baseUrl.replace(/\/+$/, ""),
  isProduction: process.env.NODE_ENV === "production",
  convexUrl: data.CONVEX_URL.replace(/\/+$/, ""),
  convexAuthSecret: data.CONVEX_AUTH_SECRET,
}
