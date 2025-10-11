import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { authClient } from '@/lib/auth-client'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Login · Shovon Hasan',
}

export const dynamic = 'force-dynamic'

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
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the credentials you configured for this site.
        </p>
      </div>
      <AdminLoginForm nextPath={nextPath} />
    </main>
  )
}
