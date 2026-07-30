import { redirect } from "next/navigation"

import { AuthRegisterForm } from "@/features/auth/register/components/register-form"
import { getCurrentUser } from "@/features/auth/user/lib/user.action"

import { resolveRedirectUrl, withCallbackUrl } from "@/core/proxy/url"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const [{ callbackUrl }, session] = await Promise.all([searchParams, getCurrentUser()])
  const redirectUrl = resolveRedirectUrl(callbackUrl)

  if (session?.isLocked) redirect(withCallbackUrl("/unlock", redirectUrl))
  if (session) redirect(redirectUrl)

  return <AuthRegisterForm callbackUrl={redirectUrl} />
}
