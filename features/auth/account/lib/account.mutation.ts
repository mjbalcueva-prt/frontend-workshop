import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { updateAccountAction } from "./account.action"
import { type AccountInput } from "./account.schema"

export function useUpdateAccount() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "update-account"],
    mutationFn: async (input: AccountInput) => {
      const result = await updateAccountAction(input)
      if ("error" in result) {
        throw new Error(result.error)
      }

      return result.user
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}
