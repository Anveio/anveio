"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
  adminFormFieldClass,
  adminInputClass,
  adminPrimaryButtonClass,
} from "@/components/admin/ui-classes"

interface AdminLoginFormProps {
  readonly nextPath?: string
  readonly defaultEmail?: string
}

export function AdminLoginForm({
  nextPath,
  defaultEmail,
}: AdminLoginFormProps) {
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
      className="flex w-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
    >
      <div className={adminFormFieldClass}>
        <label
          htmlFor="email"
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          autoComplete="username"
          required
          disabled={isPending}
          className={adminInputClass}
        />
      </div>

      <div className={adminFormFieldClass}>
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className={adminInputClass}
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={adminPrimaryButtonClass}
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
