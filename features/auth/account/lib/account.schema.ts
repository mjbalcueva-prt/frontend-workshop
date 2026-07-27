import z from "zod"

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
})

export type AccountInput = z.infer<typeof accountSchema>
