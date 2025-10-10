"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

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
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        defaultValue={defaultEmail}
        autoComplete="username"
        required
        disabled={isPending}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={isPending}
      />

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
