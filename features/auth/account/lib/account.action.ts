"use server"

import { userSchema, type User } from "@/features/auth/user/lib/user.schema"

import { protectedFetch } from "@/integrations/axios/protected-fetch"

import { accountSchema, type AccountInput } from "./account.schema"

export async function updateAccountAction(input: AccountInput): Promise<User> {
  const parsedInput = accountSchema.parse(input)

  return protectedFetch(api => api.patch<unknown>("/api/user", parsedInput), {
    schema: userSchema,
  })
}
