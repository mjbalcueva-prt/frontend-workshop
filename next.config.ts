import type { NextConfig } from "next"

import { env } from "@/env"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
}

export default nextConfig
