"use client"

import { useCallback, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { TodoList } from "@/features/todo/components/list/todo-list"
import { addTodoSchema, type AddTodoInput, type Todo } from "@/features/todo/lib/todo.schema"

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

let nextId = 1

/** Main todo view: add form, list, toggle, and delete — powered by useState */
export function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([])

  const form = useForm<AddTodoInput>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: { text: "" },
  })

  const addTodo = useCallback(
    (text: string) => {
      const id = String(nextId++)
      setTodos(prev => [...prev, { id, text, completed: false, createdAt: Date.now() }])
      form.reset()
    },
    [form]
  )

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  function onSubmit(data: AddTodoInput) {
    addTodo(data.text)
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
          <Button type="submit" form="todo-add-form" className="w-full">
            Add Todo
          </Button>
        </CardFooter>
      </Card>

      <div className="min-w-0 flex-1">
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>
    </div>
  )
}
