import { TodoItem } from "@/features/todo/components/list/todo-item"
import type { Todo } from "@/features/todo/lib/todo.schema"

/** Renders the list of todos with an empty state */
export function TodoList({
  todos,
  onToggle,
  onDelete,
}: {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">No todos yet. Add one above!</p>
    )
  }

  const pending = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)

  return (
    <div className="flex flex-col gap-2">
      {done.length > 0 && (
        <div className="flex flex-col gap-2">
          {done.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          {pending.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
