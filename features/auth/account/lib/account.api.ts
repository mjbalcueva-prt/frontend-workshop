import type { User } from "@/features/auth/user/lib/user.schema"

import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

import { type AccountInput } from "./account.schema"

export async function updateAccount(input: AccountInput): Promise<User> {
  try {
    const response = await api.patch<User>("/api/user", input)

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
