import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Server-side environment variables (only available in Node.js).
   * Add your server-only env vars here.
   */
  server: {
    API_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  /**
   * Client-side environment variables (must be prefixed with NEXT_PUBLIC_).
   * These are bundled into the client and exposed to the browser.
   */
  client: {},

  /**
   * Runtime provides the actual values. On the server, read from process.env.
   * On the client, Next.js inlines NEXT_PUBLIC_* vars at build time.
   */
  runtimeEnv: {
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Treat empty strings as undefined (useful for optional vars).
   */
  emptyStringAsUndefined: true,
})
