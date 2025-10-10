import { nextJsHandler } from '@convex-dev/better-auth/nextjs'

import { PublicEnvironmentVariables } from '@/lib/public-env'

export const { GET, POST } = nextJsHandler({
  convexSiteUrl: PublicEnvironmentVariables.convexSiteUrl,
})
