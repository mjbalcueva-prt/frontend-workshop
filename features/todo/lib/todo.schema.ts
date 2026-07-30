import { z } from "zod"

/** Zod schema for adding a new todo */
export const addTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Todo text is required")
    .max(200, "Todo text must be under 200 characters")
    .transform(v => v.trim()),
})

/** Zod schema for a single todo item (matches Laravel API response) */
export const todoSchema = z.object({
  id: z.coerce.string(),
  user_id: z.number(),
  text: z.string(),
  completed: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const todoListSchema = z.array(todoSchema)

export type Todo = z.infer<typeof todoSchema>
export type AddTodoInput = z.infer<typeof addTodoSchema>
