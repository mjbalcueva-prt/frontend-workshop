import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

import { type User } from "./user.schema"

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/api/user", {
      validateStatus: status => status === 401 || (status >= 200 && status < 300),
    })

    if (response.status === 401) return null

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
