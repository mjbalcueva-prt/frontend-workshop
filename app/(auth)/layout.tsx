import { redirect } from "next/navigation"

import { getCurrentUser } from "@/features/auth/user/lib/user.action"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      {children}
    </div>
  )
}
