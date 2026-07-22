import { TodoItem } from "@/features/todo/components/list/todo-item"
import type { Todo } from "@/features/todo/lib/todo.schema"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/** Renders the list of todos with an empty state */
export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">No todos yet. Add one above!</p>
    )
  }

  const pending = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Todo ({pending.length})
          </h3>
          {pending.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
      {done.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Done ({done.length})
          </h3>
          {done.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
