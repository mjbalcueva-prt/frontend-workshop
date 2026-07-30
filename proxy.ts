import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE } from "@/core/proxy/config"
import { withCurrentPath } from "@/core/proxy/headers"
import { getRouteAccess } from "@/core/proxy/route-matcher"

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const access = getRouteAccess(pathname)

  if (access === "protected" && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({
    request: {
      headers: withCurrentPath(request.headers, pathname + search),
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
