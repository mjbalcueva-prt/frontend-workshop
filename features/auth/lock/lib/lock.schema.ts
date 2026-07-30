import { z } from "zod"

// ─── Unlock form ───────────────────────────────────────────────────────

export const unlockSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

export type UnlockInput = z.infer<typeof unlockSchema>
