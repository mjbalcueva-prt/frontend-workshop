"use server"

import { getErrorMessage } from "@/features/auth/_utils/get-error-message"
import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type AccountInput } from "./account.schema"

type AccountActionResult = { user: User } | { error: string }
type AccountResponse = User & { message?: string }

export async function updateAccountAction(input: AccountInput): Promise<AccountActionResult> {
  const api = await createApiClient()

  try {
    const { data } = await api.patch<AccountResponse>("/api/user", input)
    return { user: data }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
