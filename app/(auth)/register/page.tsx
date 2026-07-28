import { AuthRegisterForm } from "@/features/auth/register/components/register-form"
import { GuestGuard } from "@/features/auth/user/providers/guest-guard"

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthRegisterForm />
    </GuestGuard>
  )
}
