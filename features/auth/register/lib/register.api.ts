import type { User } from "@/features/auth/user/lib/user.schema"

import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

import { type RegisterInput } from "./register.schema"

type RegisterResponse = { user: User }

export async function register(input: RegisterInput): Promise<User> {
  try {
    await api.get("/sanctum/csrf-cookie")

    const response = await api.post<RegisterResponse>("/register", input)

    return response.data.user
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
