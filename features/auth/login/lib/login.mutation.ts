import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { resolveRedirectUrl } from "@/core/proxy/url"

import { loginAction } from "./login.action"
import { type LoginInput } from "./login.schema"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async ({ input, callbackUrl }: { input: LoginInput; callbackUrl?: string }) => {
      const result = await loginAction(input)
      if ("error" in result) {
        throw new Error(result.error)
      }
      return callbackUrl
    },
    onSuccess: callbackUrl => {
      router.replace(resolveRedirectUrl(callbackUrl))
    },
  })
}
