import type { Todo } from "@/features/todo/lib/todo.schema"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"
import { cn } from "@/core/lib/utils"

/** A single todo row with a checkbox, text, and delete button */
export function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="cursor-pointer py-2 select-none" onClick={() => onToggle(todo.id)}>
      <CardContent className="flex items-center gap-3 px-4 py-1">
        <Checkbox
          checked={todo.completed}
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none"
        />
        <span
          className={cn(
            "min-w-0 flex-1 text-sm",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.text}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            onDelete(todo.id)
          }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}
