"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import { getErrorMessage } from "@/features/auth/_utils/get-error-message"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type LoginInput } from "./login.schema"

type LoginActionResult = { user: User } | { error: string }
type LoginResponse = { user: User; token: string; message?: string }

export async function loginAction(input: LoginInput): Promise<LoginActionResult> {
  const api = await createApiClient()

  try {
    const { data } = await api.post<LoginResponse>("/api/login", input)
    await setAuthCookie(data.token, input.remember)
    return { user: data.user }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
