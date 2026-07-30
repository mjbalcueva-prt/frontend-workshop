import { LockTimer } from "@/features/auth/lock/components/lock-timer"
import { UnlockModal } from "@/features/auth/lock/components/unlock-modal"
import { LockProvider } from "@/features/auth/lock/providers/lock-provider"
import { requireUnlockedSession } from "@/features/auth/user/lib/session.guard"
import { AuthProvider } from "@/features/auth/user/providers/auth-provider"

import { SiteNav } from "@/core/components/shell/site-nav"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await requireUnlockedSession()

  return (
    <AuthProvider user={data}>
      <LockProvider>
        <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
          <main className="flex w-full max-w-5xl flex-col items-center gap-8">
            <SiteNav />
            {children}
          </main>
        </div>
        <LockTimer />
        <UnlockModal />
      </LockProvider>
    </AuthProvider>
  )
}
