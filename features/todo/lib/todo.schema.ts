import { z } from "zod"

/** Zod schema for adding a new todo */
export const addTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Todo text is required")
    .max(200, "Todo text must be under 200 characters")
    .transform(v => v.trim()),
})

export type AddTodoInput = z.infer<typeof addTodoSchema>

/** Zod schema for a single todo item */
export const todoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.number(),
})

export type Todo = z.infer<typeof todoSchema>
