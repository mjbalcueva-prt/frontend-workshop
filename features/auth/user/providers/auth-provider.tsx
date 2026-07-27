"use client"

import { createContext, useContext } from "react"

import type { User } from "@/features/auth/user/lib/user.schema"

const AuthContext = createContext<User | null>(null)

export function AuthProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuth(): User {
  const user = useContext(AuthContext)

  if (!user) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return user
}
