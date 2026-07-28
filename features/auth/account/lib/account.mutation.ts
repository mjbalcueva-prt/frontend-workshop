import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { updateAccount } from "./account.api"
import { type AccountInput } from "./account.schema"

export function useUpdateAccount() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "update-account"],
    mutationFn: (input: AccountInput) => updateAccount(input),
    onSuccess: () => {
      router.refresh()
    },
  })
}
