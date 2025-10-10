import type { BetterAuthOptions } from "better-auth"

import { authEnv } from "@/lib/env"

type PluginList = NonNullable<BetterAuthOptions["plugins"]>

interface BuildAuthOptionsParams {
  readonly database: BetterAuthOptions["database"]
  readonly optionsOnly?: boolean
  readonly plugins?: PluginList
}

export function buildAuthOptions({
  database,
  optionsOnly = false,
  plugins = [],
}: BuildAuthOptionsParams): BetterAuthOptions {
  return {
    baseURL: authEnv.baseURL,
    secret: authEnv.secret,
    database,
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
        sameSite: "lax",
        path: "/",
      },
    },
    logger: {
      disabled: optionsOnly,
    },
    plugins,
  }
}
