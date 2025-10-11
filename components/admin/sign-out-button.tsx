"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { adminButtonClass } from "@/components/admin/ui-classes"

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
      className={adminButtonClass}
    >
      {isPending ? "Signing out…" : "Sign Out"}
    </button>
  )
}
