"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type RegisterInput } from "./register.schema"

type RegisterActionResult = { user: User } | { error: string }
type RegisterResponse = { user: User; token: string; message?: string }

export async function registerAction(input: RegisterInput): Promise<RegisterActionResult> {
  const api = await createApiClient()
  const response = await api.post<RegisterResponse>("/api/register", input)

  if (response.status >= 400) {
    return { error: response.data.message ?? "Unable to create your account." }
  }

  await setAuthCookie(response.data.token)
  return { user: response.data.user }
}
