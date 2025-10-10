import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { authClient } from '@/lib/auth-client'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Login · Shovon Hasan',
}

interface LoginPageProps {
  readonly searchParams?: Promise<{
    next?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await authClient.getSession()

  const resolvedParams = searchParams ? await searchParams : {}
  const nextPath = resolvedParams.next
  if (session?.data) {
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
