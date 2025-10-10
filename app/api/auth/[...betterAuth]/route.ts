import { nextJsHandler } from '@convex-dev/better-auth/nextjs'

import { authEnv } from '@/lib/public-env'

export const { GET, POST } = nextJsHandler({
  convexSiteUrl: authEnv.convexSiteUrl,
})
