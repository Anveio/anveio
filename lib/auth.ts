import "server-only"

import { nextCookies } from "better-auth/next-js"

import { createAuth, type CreateAuthOptions } from "@/convex/auth"
import { createConvexAuthContext } from "@/lib/convex-auth-context"

const convexCtx = createConvexAuthContext()

type NextAuthOptions = Omit<CreateAuthOptions, "plugins">

export function createNextAuth(
  ctx: Parameters<typeof createAuth>[0],
  options: NextAuthOptions = {},
) {
  return createAuth(ctx, {
    ...options,
    plugins: [nextCookies()],
  })
}

export const auth = createNextAuth(convexCtx)

export type AdminSession = Exclude<
  Awaited<ReturnType<(typeof auth)["api"]["getSession"]>>,
  null
>
