"use server"

import type { Todo } from "@/features/todo/lib/todo.schema"

import { createApiClient } from "@/integrations/axios/api"

/** Server action: create a new todo */
export async function createTodoAction(text: string): Promise<Todo> {
  const api = await createApiClient()
  const response = await api.post<Todo>("/api/todos", { text })

  if (response.status >= 400) {
    const error = (response.data as { message?: string }).message ?? "Failed to create todo"
    throw new Error(error)
  }

  return response.data
}

/** Server action: update a todo (toggle completed or change text) */
export async function updateTodoAction(
  id: string,
  data: { text?: string; completed?: boolean }
): Promise<Todo> {
  const api = await createApiClient()
  const response = await api.patch<Todo>(`/api/todos/${id}`, data)

  if (response.status >= 400) {
    const error = (response.data as { message?: string }).message ?? "Failed to update todo"
    throw new Error(error)
  }

  return response.data
}

/** Server action: delete a todo */
export async function deleteTodoAction(id: string): Promise<void> {
  const api = await createApiClient()
  const response = await api.delete(`/api/todos/${id}`)

  if (response.status >= 400) {
    const error = (response.data as { message?: string }).message ?? "Failed to delete todo"
    throw new Error(error)
  }
}
