import { redirect } from "next/navigation"

import { AuthRegisterForm } from "@/features/auth/register/components/register-form"
import { getCurrentUser } from "@/features/auth/user/lib/user.api"

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return <AuthRegisterForm />
}
