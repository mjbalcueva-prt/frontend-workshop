import { headers } from "next/headers"

const CURRENT_PATH_HEADER = "x-current-path"

/** Add the requested path to the headers forwarded to the route renderer. */
export function withCurrentPath(requestHeaders: Headers, currentPath: string): Headers {
  const forwardedHeaders = new Headers(requestHeaders)
  forwardedHeaders.set(CURRENT_PATH_HEADER, currentPath)
  return forwardedHeaders
}

/** Read `x-current-path` from incoming request headers. Falls back to "/". */
export async function getCurrentPath(): Promise<string> {
  const headersList = await headers()
  return headersList.get(CURRENT_PATH_HEADER) ?? "/"
}
