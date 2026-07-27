"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type LoginInput } from "./login.schema"

type LoginActionResult = { user: User } | { error: string }
type LoginResponse = { user: User; token: string; message?: string }

export async function loginAction(input: LoginInput): Promise<LoginActionResult> {
  const api = await createApiClient()
  const response = await api.post<LoginResponse>("/api/login", input)

  if (response.status >= 400) {
    return { error: response.data.message ?? "Unable to sign in." }
  }

  await setAuthCookie(response.data.token, input.remember)
  return { user: response.data.user }
}
