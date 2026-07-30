export interface RoutePattern {
  path: string
  exact?: boolean
}

export type RouteAccess = "publicOnly" | "public" | "protected"

export const DEFAULT_REDIRECT = "/"

export const AUTH_COOKIE = "auth_token"

export const AUTH_ROUTES = [
  { path: "/login", exact: true },
  { path: "/register", exact: true },
  { path: "/unlock", exact: true },
] as const satisfies readonly RoutePattern[]

/**
 * Routes are public by default. Only paths explicitly listed under
 * `protected` receive the Proxy's optimistic cookie check.
 */
export const ROUTE_CONFIG = {
  publicOnly: [...AUTH_ROUTES],
  public: [{ path: "/", exact: true }],
  protected: [{ path: "/account" }, { path: "/pokemon" }, { path: "/todo" }],
} as const satisfies Record<RouteAccess, readonly RoutePattern[]>
