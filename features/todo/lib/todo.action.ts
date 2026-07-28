"use server"

import type { Todo } from "@/features/todo/lib/todo.schema"

import { createApiClient } from "@/integrations/axios/api"

export async function getTodos(): Promise<Todo[]> {
  const api = await createApiClient()
  const { data } = await api.get<Todo[]>("/api/todos")
  return data
}

/** Server action: create a new todo */
export async function createTodoAction(text: string): Promise<Todo> {
  const api = await createApiClient()
  const { data } = await api.post<Todo>("/api/todos", { text })
  return data
}

/** Server action: update a todo (toggle completed or change text) */
export async function updateTodoAction(
  id: string,
  body: { text?: string; completed?: boolean }
): Promise<Todo> {
  const api = await createApiClient()
  const { data } = await api.patch<Todo>(`/api/todos/${id}`, body)
  return data
}

/** Server action: delete a todo */
export async function deleteTodoAction(id: string): Promise<void> {
  const api = await createApiClient()
  await api.delete(`/api/todos/${id}`)
}
