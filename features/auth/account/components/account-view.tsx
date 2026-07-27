"use client"

import Link from "next/link"

import { AccountUpdateForm } from "@/features/auth/account/components/account-update-form"
import { SessionCard } from "@/features/auth/user/components/session-card"

export function AuthAccountView() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AccountUpdateForm />
      <SessionCard />

      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2 transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  )
}
