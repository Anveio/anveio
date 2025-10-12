import { requireAdminSession } from '@/lib/admin-session'

export default async function AdminDashboard() {
  const session = await requireAdminSession('/admin')

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
        <header className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Signed in as {session.user.email}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Workspace
          </h1>
        </header>
        <p className="mt-6 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          Posts now live as repository-authored modules (Markdown or React).
          Use your editor and git history for revisions; this control panel will grow new tooling as code-first workflows settle in.
        </p>
      </section>
    </main>
  )
}
