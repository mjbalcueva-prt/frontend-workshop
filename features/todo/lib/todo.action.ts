"use server"

import { todoListSchema, todoSchema, type Todo } from "@/features/todo/lib/todo.schema"

import { protectedFetch } from "@/integrations/axios/protected-fetch"

export async function getTodos(): Promise<Todo[]> {
  return protectedFetch(api => api.get<unknown>("/api/todos"), {
    schema: todoListSchema,
  })
}

/** Server action: create a new todo */
export async function createTodoAction(text: string): Promise<Todo> {
  return protectedFetch(api => api.post<unknown>("/api/todos", { text }), {
    schema: todoSchema,
  })
}

/** Server action: update a todo (toggle completed or change text) */
export async function updateTodoAction(
  id: string,
  body: { text?: string; completed?: boolean }
): Promise<Todo> {
  return protectedFetch(api => api.patch<unknown>(`/api/todos/${id}`, body), {
    schema: todoSchema,
  })
}

/** Server action: delete a todo */
export async function deleteTodoAction(id: string): Promise<void> {
  return protectedFetch(api => api.delete<unknown>(`/api/todos/${id}`))
}
