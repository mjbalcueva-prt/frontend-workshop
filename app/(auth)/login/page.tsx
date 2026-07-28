import { AuthLoginForm } from "@/features/auth/login/components/auth-login-form"
import { GuestGuard } from "@/features/auth/user/providers/guest-guard"

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthLoginForm />
    </GuestGuard>
  )
}
