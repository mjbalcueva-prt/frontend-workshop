"use client"

import { redirect } from "next/navigation"

import { useUser } from "@/features/auth/user/lib/user.query"

import { Spinner } from "@/core/components/ui/spinner"

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (user) {
    redirect("/")
  }

  return <>{children}</>
}
