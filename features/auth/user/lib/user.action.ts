import "server-only"

import { cache } from "react"

import { createApiClient } from "@/integrations/axios/api"
import { getApiErrorStatus } from "@/integrations/axios/api.error"

import { userResponseSchema, type UserResponse } from "./user.schema"

export const getCurrentUser = cache(async (): Promise<UserResponse | null> => {
  const api = await createApiClient()

  try {
    const { data } = await api.get<unknown>("/api/user")
    return userResponseSchema.parse(data)
  } catch (error) {
    if (getApiErrorStatus(error) === 401) return null
    throw error
  }
})
