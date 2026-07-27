import { TodoView } from "@/features/todo/components/todo-view"
import { getTodos } from "@/features/todo/lib/todo.api"

export default async function TodoPage() {
  const todos = await getTodos()

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Todos
        </h1>
        <p className="text-muted-foreground text-sm">Keep track of what needs to get done.</p>
      </div>

      <TodoView initialTodos={todos} />
    </>
  )
}
