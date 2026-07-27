import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { logoutAction } from "./logout.action"

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logoutAction,
    onSuccess: () => {
      router.replace("/login")
    },
  })
}
