"use client"

import { TodoView } from "@/features/todo/components/todo-view"
import { useTodos } from "@/features/todo/lib/todo.query"

import { Spinner } from "@/core/components/ui/spinner"

export default function TodoPage() {
  const { data: todos, isLoading } = useTodos()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Todos
        </h1>
        <p className="text-muted-foreground text-sm">Keep track of what needs to get done.</p>
      </div>

      <TodoView initialTodos={todos ?? []} />
    </>
  )
}
