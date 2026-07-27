import { redirect } from "next/navigation"

import { AuthLoginForm } from "@/features/auth/login/components/auth-login-form"
import { getCurrentUser } from "@/features/auth/user/lib/user.api"

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return <AuthLoginForm />
}
