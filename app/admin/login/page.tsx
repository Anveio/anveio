import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata: Metadata = {
  title: 'Admin Login · Shovon Hasan',
}

interface LoginPageProps {
  readonly searchParams?: Promise<{
    next?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const headerSnapshot = new Headers(await headers())
  const session = await auth.api.getSession({ headers: headerSnapshot })

  const resolvedParams = searchParams ? await searchParams : {}
  const nextPath = resolvedParams.next
  if (session?.session) {
    redirect(nextPath?.startsWith('/') ? nextPath : '/admin')
  }

  return (
    <main>
      <h1>Admin Login</h1>
      <p>Enter the credentials you configured for this site.</p>
      <AdminLoginForm nextPath={nextPath} />
    </main>
  )
}
