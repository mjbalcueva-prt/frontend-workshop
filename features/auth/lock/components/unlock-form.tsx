"use client"

import { type Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { SecurityLockIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Controller, useForm } from "react-hook-form"

import { useUnlock } from "@/features/auth/lock/lib/lock.mutation"
import { unlockSchema, type UnlockInput } from "@/features/auth/lock/lib/lock.schema"
import { useLockSession } from "@/features/auth/lock/providers/lock-provider"
import { useLogout } from "@/features/auth/logout/lib/logout.mutation"

import { Alert, AlertDescription } from "@/core/components/reui/alert"
import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"

export function UnlockForm({ callbackUrl }: { callbackUrl: Route }) {
  const router = useRouter()
  const { phase, activateSession } = useLockSession()

  useEffect(() => {
    if (phase === "active") router.replace(callbackUrl)
  }, [callbackUrl, phase, router])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SecurityLockIcon} strokeWidth={2} />
          <CardTitle>Session Locked</CardTitle>
        </div>
        <CardDescription>
          Your session was locked due to inactivity. Enter your password to continue.
        </CardDescription>
      </CardHeader>
      <UnlockFormForm onUnlocked={activateSession} />
    </Card>
  )
}

function UnlockFormForm({ onUnlocked }: { onUnlocked: () => void }) {
  const unlock = useUnlock()
  const logout = useLogout()

  const form = useForm<UnlockInput>({
    resolver: zodResolver(unlockSchema),
    defaultValues: { password: "" },
  })

  const onSubmit = (data: UnlockInput) => {
    unlock.mutate(data.password, {
      onSuccess: () => {
        form.reset()
        onUnlocked()
      },
    })
  }

  const isPending = unlock.isPending || logout.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CardContent>
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-disabled={isPending} data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="Enter your password"
                  autoFocus
                  autoComplete="current-password"
                  disabled={isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {unlock.error && (
            <Alert variant="destructive">
              <AlertDescription>{unlock.error.message}</AlertDescription>
            </Alert>
          )}
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-3 *:flex-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => logout.mutate()}
          disabled={isPending}
        >
          {logout.isPending && <Spinner data-icon="inline-start" />}
          Sign Out
        </Button>
        <Button type="submit" disabled={isPending}>
          {unlock.isPending ? <Spinner data-icon="inline-start" /> : null}
          Unlock
        </Button>
      </CardFooter>
    </form>
  )
}
