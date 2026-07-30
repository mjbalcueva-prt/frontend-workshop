import { z } from "zod"

/** Authenticated user returned by the API */
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type User = z.infer<typeof userSchema>

/** Shape the authenticated session endpoint returns. */
export const userResponseSchema = userSchema.extend({
  isLocked: z.boolean(),
})

export type UserResponse = z.infer<typeof userResponseSchema>
