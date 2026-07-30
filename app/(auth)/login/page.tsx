import { redirect } from "next/navigation"

import { AuthLoginForm } from "@/features/auth/login/components/auth-login-form"
import { getCurrentUser } from "@/features/auth/user/lib/user.action"

import { resolveRedirectUrl, withCallbackUrl } from "@/core/proxy/url"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const [{ callbackUrl }, session] = await Promise.all([searchParams, getCurrentUser()])
  const redirectUrl = resolveRedirectUrl(callbackUrl)

  if (session?.isLocked) redirect(withCallbackUrl("/unlock", redirectUrl))
  if (session) redirect(redirectUrl)

  return <AuthLoginForm callbackUrl={redirectUrl} />
}
