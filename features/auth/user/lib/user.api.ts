import "server-only"

import { createApiClient } from "@/integrations/axios/api"

import { type User } from "./user.schema"

export async function getCurrentUser(): Promise<User | null> {
  const api = await createApiClient()
  const response = await api.get<User>("/api/user")

  if (response.status === 401) return null
  if (response.status >= 400) throw new Error("Unable to load the current user.")

  return response.data
}
