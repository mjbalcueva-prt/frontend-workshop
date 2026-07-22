import { TodoView } from "@/features/todo/components/todo-view"

export default function TodoPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Todos
        </h1>
        <p className="text-muted-foreground text-sm">Keep track of what needs to get done.</p>
      </div>

      <TodoView />
    </>
  )
}
