import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

export async function logout(): Promise<void> {
  try {
    await api.post("/logout")
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
