import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

import { PublicEnvironmentVariables } from '@/lib/public-env'

const resolveBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return PublicEnvironmentVariables.baseUrl
}

export const authClient = createAuthClient({
  baseURL: resolveBaseUrl(),
  plugins: [convexClient()],
})
