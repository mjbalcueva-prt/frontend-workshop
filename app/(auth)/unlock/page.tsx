import { redirect } from "next/navigation"

import { UnlockForm } from "@/features/auth/lock/components/unlock-form"
import { LockProvider } from "@/features/auth/lock/providers/lock-provider"
import { getCurrentUser } from "@/features/auth/user/lib/user.action"

import { resolveRedirectUrl, withCallbackUrl } from "@/core/proxy/url"

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const [{ callbackUrl }, session] = await Promise.all([searchParams, getCurrentUser()])
  const redirectUrl = resolveRedirectUrl(callbackUrl)

  if (!session) redirect(withCallbackUrl("/login", redirectUrl))
  if (!session.isLocked) redirect(redirectUrl)

  return (
    <LockProvider initiallyLocked>
      <UnlockForm callbackUrl={redirectUrl} />
    </LockProvider>
  )
}
