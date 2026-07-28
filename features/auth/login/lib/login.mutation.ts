import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { login } from "./login.api"
import { type LoginInput } from "./login.schema"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: () => {
      router.replace("/")
      router.refresh()
    },
  })
}
