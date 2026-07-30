"use server"

import { getErrorMessage } from "@/features/auth/_utils/get-error-message"

import { createApiClient } from "@/integrations/axios/api"

import { unlockSchema, type UnlockInput } from "./lock.schema"

export type LockActionResult = { success: true } | { error: string }

export async function lockSessionAction(): Promise<LockActionResult> {
  try {
    const api = await createApiClient()
    await api.post("/api/session/lock")
    return { success: true }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

export async function unlockAction(input: UnlockInput): Promise<LockActionResult> {
  const parsedInput = unlockSchema.safeParse(input)

  if (!parsedInput.success) {
    return { error: parsedInput.error.issues[0]?.message ?? "Invalid password" }
  }

  try {
    const api = await createApiClient()
    await api.post("/api/session/unlock", parsedInput.data)
    return { success: true }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
