import { redirect } from "next/navigation"

import { getCurrentUser } from "@/features/auth/user/lib/user.action"
import { AuthProvider } from "@/features/auth/user/providers/auth-provider"

import { SiteNav } from "@/core/components/shell/site-nav"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <AuthProvider user={user}>
      <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
        <main className="flex w-full max-w-5xl flex-col items-center gap-8">
          <SiteNav />
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
