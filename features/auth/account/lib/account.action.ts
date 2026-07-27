"use server"

import type { User } from "@/features/auth/user/lib/user.schema"

import { createApiClient } from "@/integrations/axios/api"

import { type AccountInput } from "./account.schema"

type AccountActionResult = { user: User } | { error: string }
type AccountResponse = User & { message?: string }

export async function updateAccountAction(input: AccountInput): Promise<AccountActionResult> {
  const api = await createApiClient()
  const response = await api.patch<AccountResponse>("/api/user", input)

  if (response.status >= 400) {
    return { error: response.data.message ?? "Unable to update your account." }
  }

  return { user: response.data }
}
