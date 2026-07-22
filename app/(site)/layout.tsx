"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/core/lib/utils"

const navLinks = [
  { href: "/", label: "Pokédex" },
  { href: "/todo", label: "Todos" },
]

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-black underline underline-offset-4 dark:text-zinc-50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {children}
      </main>
    </div>
  )
}
