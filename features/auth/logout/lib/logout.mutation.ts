import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { logout } from "./logout.api"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      router.replace("/login")
      router.refresh()
    },
  })
}
