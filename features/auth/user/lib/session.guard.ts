import "server-only"

import { type Route } from "next"
import { redirect } from "next/navigation"
import { cache } from "react"

import { getCurrentPath } from "@/core/proxy/headers"
import { withCallbackUrl } from "@/core/proxy/url"

import { getCurrentUser } from "./user.action"
import type { UserResponse } from "./user.schema"

async function redirectWithCurrentPath(destination: Route): Promise<never> {
  const currentPath = await getCurrentPath()
  return redirect(withCallbackUrl(destination, currentPath))
}

export function redirectToLogin(): Promise<never> {
  return redirectWithCurrentPath("/login")
}

export function redirectToUnlock(): Promise<never> {
  return redirectWithCurrentPath("/unlock")
}

export const requireUnlockedSession = cache(async (): Promise<UserResponse> => {
  const session = await getCurrentUser()

  if (!session) return redirectToLogin()
  if (session.isLocked) return redirectToUnlock()

  return session
})
