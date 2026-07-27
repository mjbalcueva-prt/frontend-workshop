import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createTodoAction,
  deleteTodoAction,
  fetchTodosAction,
  updateTodoAction,
} from "@/features/todo/lib/todo.action"

export const todosQueryKey = ["todos"] as const

/** Query options for fetching all todos */
export function todosQueryOptions() {
  return queryOptions({
    queryKey: [...todosQueryKey],
    queryFn: () => fetchTodosAction(),
  })
}

/** Hook to fetch the todo list (read) */
export function useTodos() {
  return useQuery(todosQueryOptions())
}

/** Hook to create a new todo (mutation) */
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...todosQueryKey, "create"],
    mutationFn: (text: string) => createTodoAction(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

/** Hook to toggle a todo's completed status (mutation) */
export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...todosQueryKey, "toggle"],
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodoAction(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

/** Hook to delete a todo (mutation) */
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...todosQueryKey, "delete"],
    mutationFn: (id: string) => deleteTodoAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}
