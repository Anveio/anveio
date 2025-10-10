import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { authClient } from './auth-client'

async function buildHeaders(): Promise<Headers> {
  return new Headers(await headers())
}

export async function getAdminSession() {
  return authClient.getSession({
    fetchOptions: { headers: await buildHeaders() },
  })
}

export async function requireAdminSession(nextPath: string) {
  const session = await getAdminSession()

  if (!session) {
    const search = nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''
    redirect(`/admin/login${search}`)
  }

  return session
}
