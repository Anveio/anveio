import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { authClient } from './auth-client'
import { isAdmin, type Role } from '@/lib/auth/roles'

type AuthSession = (typeof authClient)['$Infer']['Session']

async function buildHeaders(): Promise<Headers> {
  return new Headers(await headers())
}

export async function getAdminSession(): Promise<AuthSession | null> {
  const result = await authClient.getSession({
    fetchOptions: { headers: await buildHeaders() },
  })

  if (!result || result.error) {
    return null
  }

  return result.data
}

export async function requireAdminSession(
  nextPath: string,
): Promise<AuthSession> {
  const session = await getAdminSession()

  const userRoles =
    (session as { user?: { roles?: ReadonlyArray<Role> } } | null)?.user
      ?.roles ??
    (session as { session?: { roles?: ReadonlyArray<Role> } } | null)?.session
      ?.roles

  if (!session || !isAdmin({ roles: userRoles })) {
    const search = nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''
    redirect(`/admin/login${search}`)
  }

  return session
}
