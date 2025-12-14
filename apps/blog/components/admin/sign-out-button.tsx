"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await authClient.signOut()
      router.replace("/admin/login")
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
    >
      {isPending ? "Signing out…" : "Sign Out"}
    </button>
  )
}
