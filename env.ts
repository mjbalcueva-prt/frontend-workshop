import { createEnv } from "@t3-oss/env-nextjs"
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used when adding env schemas
import { z } from "zod"

export const env = createEnv({
  /**
   * Server-side environment variables (only available in Node.js).
   * Add your server-only env vars here.
   */
  server: {},

  /**
   * Client-side environment variables (must be prefixed with NEXT_PUBLIC_).
   * These are bundled into the client and exposed to the browser.
   */
  client: {
    // Example: NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },

  /**
   * Runtime provides the actual values. On the server, read from process.env.
   * On the client, Next.js inlines NEXT_PUBLIC_* vars at build time.
   */
  runtimeEnv: {
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  /**
   * Treat empty strings as undefined (useful for optional vars).
   */
  emptyStringAsUndefined: true,
})
