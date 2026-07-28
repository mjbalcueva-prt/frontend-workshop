import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { register } from "./register.api"
import { type RegisterInput } from "./register.schema"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => {
      router.replace("/")
      router.refresh()
    },
  })
}
