"use client"

import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { TodoList } from "@/features/todo/components/list/todo-list"
import { useCreateTodo, useDeleteTodo, useToggleTodo } from "@/features/todo/lib/todo.mutation"
import { useTodos } from "@/features/todo/lib/todo.query"
import { addTodoSchema, type AddTodoInput, type Todo } from "@/features/todo/lib/todo.schema"

import { Alert, AlertDescription } from "@/core/components/reui/alert"
import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"

export function TodoView({ initialTodos }: { initialTodos?: Todo[] }) {
  const todos = useTodos(initialTodos)
  const createTodo = useCreateTodo()
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()

  const form = useForm<AddTodoInput>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: { text: "" },
  })

  const handleToggle = useCallback(
    (id: string) => {
      const list = todos.data ?? []
      const todo = list.find(t => t.id === id)
      if (todo) {
        toggleTodo.mutate({ id, completed: !todo.completed })
      }
    },
    [todos.data, toggleTodo]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteTodo.mutate(id)
    },
    [deleteTodo]
  )

  const onSubmit = (data: AddTodoInput) => {
    createTodo.mutate(data.text, {
      onSuccess: () => form.reset(),
    })
  }

  return (
    <div className="flex w-full items-start gap-8">
      <Card className="w-80 shrink-0">
        <CardHeader>
          <CardTitle>Add Todo</CardTitle>
          <CardDescription>Type a task and press enter to add it.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="todo-add-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="todo-text-input">Task</FieldLabel>
                    <Input
                      {...field}
                      id="todo-text-input"
                      placeholder="e.g. Buy groceries"
                      autoComplete="off"
                      disabled={createTodo.isPending}
                    />
                    <FieldDescription>What needs to get done?</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="todo-add-form"
            className="w-full"
            disabled={createTodo.isPending}
          >
            {createTodo.isPending && <Spinner data-icon="inline-start" />}
            Add Todo
          </Button>
        </CardFooter>
      </Card>

      <div className="min-w-0 flex-1">
        {todos.isLoading && (
          <p className="text-muted-foreground py-8 text-center text-sm">Loading todos...</p>
        )}
        {!todos.isLoading && todos.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {todos.error instanceof Error ? todos.error.message : "Failed to load todos"}
            </AlertDescription>
          </Alert>
        )}
        {!todos.isLoading && !todos.isError && (
          <TodoList todos={todos.data ?? []} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
