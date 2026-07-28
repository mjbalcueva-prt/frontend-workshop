import type { User } from "@/features/auth/user/lib/user.schema"

import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

import { type LoginInput } from "./login.schema"

type LoginResponse = { user: User }

export async function login(input: LoginInput): Promise<User> {
  try {
    await api.get("/sanctum/csrf-cookie")

    const response = await api.post<LoginResponse>("/login", input)

    return response.data.user
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
