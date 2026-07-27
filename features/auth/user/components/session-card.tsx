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
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="font-mono">{user.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Joined</dt>
            <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
