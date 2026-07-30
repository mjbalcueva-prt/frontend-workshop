"use client"

import { useAuth } from "@/features/auth/user/providers/auth-provider"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

export function SessionCard() {
  const user = useAuth()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Session</CardTitle>
        <CardDescription>
          Signed in since {new Date(user.created_at).toLocaleDateString()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-50">
          {JSON.stringify(user, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
