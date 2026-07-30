import "server-only"

import { cookies } from "next/headers"

import { AUTH_COOKIE } from "@/core/proxy/config"

import { env } from "@/env"

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value
}

export async function setAuthCookie(token: string, remember = false): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    priority: "high",
    ...(remember ? { maxAge: REMEMBER_MAX_AGE } : {}),
  })
}

export async function deleteAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}
