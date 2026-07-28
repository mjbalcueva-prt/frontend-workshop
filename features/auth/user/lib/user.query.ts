import { queryOptions, useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/features/auth/user/lib/user.api"

export const authQueryKey = ["auth", "user"] as const

export function userQueryOptions() {
  return queryOptions({
    queryKey: [...authQueryKey],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
  })
}

/** Hook to fetch the current user (read) */
export function useUser() {
  return useQuery(userQueryOptions())
}
