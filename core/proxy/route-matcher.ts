import { AUTH_ROUTES, ROUTE_CONFIG, type RouteAccess, type RoutePattern } from "@/core/proxy/config"

const ROUTE_ACCESS_ORDER = ["publicOnly", "public", "protected"] as const

/** Match an exact path or a complete path segment and its descendants. */
export function matchesRoute(pathname: string, pattern: RoutePattern): boolean {
  if (pattern.exact) return pathname === pattern.path
  return pathname === pattern.path || pathname.startsWith(`${pattern.path}/`)
}

/** Return null for unlisted routes, which are public by default. */
export function getRouteAccess(pathname: string): RouteAccess | null {
  for (const access of ROUTE_ACCESS_ORDER) {
    if (ROUTE_CONFIG[access].some(pattern => matchesRoute(pathname, pattern))) {
      return access
    }
  }

  return null
}

export function isAuthPage(pathname: string): boolean {
  return AUTH_ROUTES.some(pattern => matchesRoute(pathname, pattern))
}
