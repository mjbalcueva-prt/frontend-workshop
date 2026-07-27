"use server"

import { deleteAuthCookie } from "@/features/auth/_utils/auth.cookie"

import { createApiClient } from "@/integrations/axios/api"

export async function logoutAction(): Promise<void> {
  try {
    const api = await createApiClient()
    await api.post("/api/logout")
  } catch {
    // Still remove the local cookie if Laravel is unavailable.
  } finally {
    await deleteAuthCookie()
  }
}
