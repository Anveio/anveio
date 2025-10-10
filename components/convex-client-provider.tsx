'use client'

import type { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'

import { authClient } from '@/lib/auth-client'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  throw new Error(
    'NEXT_PUBLIC_CONVEX_URL must be defined for ConvexClientProvider',
  )
}

const convex = new ConvexReactClient(convexUrl, {
  expectAuth: true,
})

interface ConvexClientProviderProps {
  readonly children: ReactNode
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
