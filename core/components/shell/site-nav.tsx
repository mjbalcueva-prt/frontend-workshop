"use client"

import { type Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { LogoutButton } from "@/features/auth/logout/components/logout-button"
import { UserMenu } from "@/features/auth/user/components/user-menu"

import { Separator } from "@/core/components/ui/separator"
import { cn } from "@/core/lib/utils"

const navLinks: { href: Route; label: string }[] = [
  { href: "/", label: "Pokédex" },
  { href: "/todo", label: "Todos" },
]

const linkClass =
  "text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"

const activeLinkClass = "text-black underline underline-offset-4 dark:text-zinc-50"

export function SiteNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4">
      {navLinks.map(link => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(linkClass, isActive && activeLinkClass)}
          >
            {link.label}
          </Link>
        )
      })}

      <Separator orientation="vertical" />

      <UserMenu />
      <LogoutButton />
    </div>
  )
}
