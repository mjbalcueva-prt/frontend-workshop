"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import { getErrorMessage } from "@/features/auth/_utils/get-error-message"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { loginSchema, type LoginInput } from "./login.schema"

type LoginActionResult = { user: User } | { error: string }
type LoginResponse = { user: User; token: string; message?: string }

export async function loginAction(input: LoginInput): Promise<LoginActionResult> {
  const parsedInput = loginSchema.safeParse(input)

  if (!parsedInput.success) {
    return { error: parsedInput.error.issues[0]?.message ?? "Invalid credentials" }
  }

  try {
    const api = await createApiClient()
    const { data } = await api.post<LoginResponse>("/api/login", parsedInput.data)
    await setAuthCookie(data.token, parsedInput.data.remember)
    return { user: data.user }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
