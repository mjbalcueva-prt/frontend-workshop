"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import { getErrorMessage } from "@/features/auth/_utils/get-error-message"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { registerSchema, type RegisterInput } from "./register.schema"

type RegisterActionResult = { user: User } | { error: string }
type RegisterResponse = { user: User; token: string; message?: string }

export async function registerAction(input: RegisterInput): Promise<RegisterActionResult> {
  const parsedInput = registerSchema.safeParse(input)

  if (!parsedInput.success) {
    return { error: parsedInput.error.issues[0]?.message ?? "Invalid registration details" }
  }

  try {
    const api = await createApiClient()
    const { data } = await api.post<RegisterResponse>("/api/register", parsedInput.data)
    await setAuthCookie(data.token)
    return { user: data.user }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
