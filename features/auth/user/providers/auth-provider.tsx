"use client"

import { redirect } from "next/navigation"
import { createContext, useContext } from "react"

import { useUser } from "@/features/auth/user/lib/user.query"
import type { User } from "@/features/auth/user/lib/user.schema"

import { Spinner } from "@/core/components/ui/spinner"

const AuthContext = createContext<User | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuth(): User {
  const user = useContext(AuthContext)

  if (!user) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return user
}
