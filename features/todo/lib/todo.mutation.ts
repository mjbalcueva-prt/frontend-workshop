import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createTodo, deleteTodo, updateTodo } from "@/features/todo/lib/todo.api"
import { todosQueryKey } from "@/features/todo/lib/todo.query"

/** Hook to create a new todo (mutation) */
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["todos", "create"],
    mutationFn: (text: string) => createTodo(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

/** Hook to toggle a todo's completed status (mutation) */
export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["todos", "toggle"],
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

/** Hook to delete a todo (mutation) */
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["todos", "delete"],
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}
