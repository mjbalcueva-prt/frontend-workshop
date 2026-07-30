import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { updateAccountAction } from "./account.action"
import { type AccountInput } from "./account.schema"

export function useUpdateAccount() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "update-account"],
    mutationFn: (input: AccountInput) => updateAccountAction(input),
    onSuccess: () => {
      router.refresh()
    },
  })
}
