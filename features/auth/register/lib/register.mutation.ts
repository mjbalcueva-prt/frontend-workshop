import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { registerAction } from "./register.action"
import { type RegisterInput } from "./register.schema"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (input: RegisterInput) => {
      const result = await registerAction(input)
      if ("error" in result) {
        throw new Error(result.error)
      }

      return result.user
    },
    onSuccess: () => {
      router.replace("/")
    },
  })
}
