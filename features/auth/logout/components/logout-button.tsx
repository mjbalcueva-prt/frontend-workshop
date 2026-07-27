"use client"

import { cn } from "@/core/lib/utils"

import { useLogout } from "../lib/logout.mutation"

const linkClass =
  "text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"

export function LogoutButton() {
  const logout = useLogout()

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className={cn(linkClass, "cursor-pointer disabled:opacity-50")}
    >
      {logout.isPending ? "..." : "Sign out"}
    </button>
  )
}
