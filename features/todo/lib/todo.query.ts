import { queryOptions, useQuery } from "@tanstack/react-query"

import { getTodos } from "@/features/todo/lib/todo.api"
import type { Todo } from "@/features/todo/lib/todo.schema"

export const todosQueryKey = ["todos"] as const

/** Query options for fetching all todos */
export function todosQueryOptions(initialData?: Todo[]) {
  return queryOptions({
    queryKey: [...todosQueryKey],
    queryFn: () => getTodos(),
    initialData,
  })
}

/** Hook to fetch the todo list (read) */
export function useTodos(initialData?: Todo[]) {
  return useQuery(todosQueryOptions(initialData))
}
