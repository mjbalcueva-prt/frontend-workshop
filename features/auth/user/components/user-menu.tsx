"use client"

import { type Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/features/auth/user/providers/auth-provider"

import { cn } from "@/core/lib/utils"

const linkClass =
  "text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"

const activeLinkClass = "text-black underline underline-offset-4 dark:text-zinc-50"

export function UserMenu() {
  const pathname = usePathname()
  const user = useAuth()

  return (
    <Link
      href={"/account" as Route}
      className={cn(linkClass, pathname === "/account" && activeLinkClass)}
    >
      {user.name}
    </Link>
  )
}
