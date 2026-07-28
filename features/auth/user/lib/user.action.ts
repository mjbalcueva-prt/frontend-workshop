import "server-only"

import { isAxiosError } from "axios"

import { createApiClient } from "@/integrations/axios/api"

import { type User } from "./user.schema"

export async function getCurrentUser(): Promise<User | null> {
  const api = await createApiClient()

  try {
    const { data } = await api.get<User>("/api/user")
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null
    throw error
  }
}
