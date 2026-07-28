import type { Todo } from "@/features/todo/lib/todo.schema"

import { api } from "@/integrations/axios/api"

import { getErrorMessage } from "@/core/lib/get-error-message"

export async function getTodos(): Promise<Todo[]> {
  try {
    const { data } = await api.get<Todo[]>("/api/todos")
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/** Create a new todo */
export async function createTodo(text: string): Promise<Todo> {
  try {
    const { data } = await api.post<Todo>("/api/todos", { text })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/** Update a todo (toggle completed or change text) */
export async function updateTodo(
  id: string,
  body: { text?: string; completed?: boolean }
): Promise<Todo> {
  try {
    const { data } = await api.patch<Todo>(`/api/todos/${id}`, body)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/** Delete a todo */
export async function deleteTodo(id: string): Promise<void> {
  try {
    await api.delete(`/api/todos/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
