import { type Route } from "next"

import { DEFAULT_REDIRECT } from "@/core/proxy/config"
import { isAuthPage } from "@/core/proxy/route-matcher"

const APP_ORIGIN = "http://app.local"

/**
 * Resolve an untrusted callback URL to a same-origin application path.
 */
export function resolveRedirectUrl(callbackUrl?: string | null): Route {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return DEFAULT_REDIRECT
  }

  try {
    const url = new URL(callbackUrl, APP_ORIGIN)

    if (url.origin !== APP_ORIGIN || isAuthPage(url.pathname)) {
      return DEFAULT_REDIRECT
    }

    return `${url.pathname}${url.search}${url.hash}` as Route
  } catch {
    return DEFAULT_REDIRECT
  }
}

/**
 * Append `?callbackUrl=<encoded>` to a base path.
 * Returns the base path unchanged if callbackPath is empty or "/".
 */
export function withCallbackUrl(basePath: Route, callbackPath: string): Route {
  const safeCallbackPath = resolveRedirectUrl(callbackPath)
  if (safeCallbackPath === DEFAULT_REDIRECT) return basePath
  return `${basePath}?callbackUrl=${encodeURIComponent(safeCallbackPath)}` as Route
}
