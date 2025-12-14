"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

interface AdminLoginFormProps {
  readonly nextPath?: string
  readonly defaultEmail?: string
}

export function AdminLoginForm({ nextPath, defaultEmail }: AdminLoginFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      setError("Both email and password are required.")
      return
    }

    setError(null)
    startTransition(async () => {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      })

      if (signInError) {
        setError(signInError.message ?? "Invalid credentials.")
        return
      }

      const destination = nextPath?.startsWith("/") ? nextPath : "/admin"
      router.replace(destination)
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
    >
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Email
        </span>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          autoComplete="username"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-700"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Password
        </span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-700"
        />
      </label>

      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
