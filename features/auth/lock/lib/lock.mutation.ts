import { useMutation } from "@tanstack/react-query"

import { lockSessionAction, unlockAction } from "./lock.action"

export function useLock() {
  return useMutation({
    mutationKey: ["auth", "lock"],
    mutationFn: async () => {
      const result = await lockSessionAction()
      if ("error" in result) throw new Error(result.error)
    },
  })
}

export function useUnlock() {
  return useMutation({
    mutationKey: ["auth", "unlock"],
    mutationFn: async (password: string) => {
      const result = await unlockAction({ password })
      if ("error" in result) throw new Error(result.error)
    },
  })
}
