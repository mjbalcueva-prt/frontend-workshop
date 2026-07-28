"use server"

import { setAuthCookie } from "@/features/auth/_utils/auth.cookie"
import { getErrorMessage } from "@/features/auth/_utils/get-error-message"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type RegisterInput } from "./register.schema"

type RegisterActionResult = { user: User } | { error: string }
type RegisterResponse = { user: User; token: string; message?: string }

export async function registerAction(input: RegisterInput): Promise<RegisterActionResult> {
  const api = await createApiClient()

  try {
    const { data } = await api.post<RegisterResponse>("/api/register", input)
    await setAuthCookie(data.token)
    return { user: data.user }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
