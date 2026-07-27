"use server"

import type { Todo } from "@/features/todo/lib/todo.schema"

import { createApiClient } from "@/integrations/axios/api"

export async function getTodos(): Promise<Todo[]> {
  const api = await createApiClient()
  const response = await api.get<Todo[]>("/api/todos")

  if (response.status >= 400) {
    const error = (response.data as { message?: string }).message ?? "Failed to fetch todos"
    throw new Error(error)
  }

  return response.data
}
