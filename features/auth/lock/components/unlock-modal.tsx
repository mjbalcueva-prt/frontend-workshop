"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SecurityLockIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Controller, useForm } from "react-hook-form"

import { useUnlock } from "@/features/auth/lock/lib/lock.mutation"
import { unlockSchema, type UnlockInput } from "@/features/auth/lock/lib/lock.schema"
import { useLockSession } from "@/features/auth/lock/providers/lock-provider"
import { useLogout } from "@/features/auth/logout/lib/logout.mutation"

import { Alert, AlertDescription } from "@/core/components/reui/alert"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog"
import { Button } from "@/core/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"

export function UnlockModal() {
  const { phase, lockError, retryLock, activateSession } = useLockSession()
  const open = phase === "locking" || phase === "locked" || phase === "error"
  const canUnlock = phase === "locked"

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={SecurityLockIcon} strokeWidth={2} />
          </AlertDialogMedia>
          <AlertDialogTitle>Session Locked</AlertDialogTitle>
          <AlertDialogDescription>
            {canUnlock
              ? "Your work is still here. Enter your password to continue."
              : "Your work is still here while we secure this session."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UnlockModalForm
          canUnlock={canUnlock}
          lockError={lockError}
          onRetryLock={retryLock}
          onUnlocked={activateSession}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UnlockModalForm({
  canUnlock,
  lockError,
  onRetryLock,
  onUnlocked,
}: {
  canUnlock: boolean
  lockError: string | null
  onRetryLock: () => void
  onUnlocked: () => void
}) {
  const unlock = useUnlock()
  const logout = useLogout()

  const form = useForm<UnlockInput>({
    resolver: zodResolver(unlockSchema),
    defaultValues: { password: "" },
  })

  const onSubmit = (data: UnlockInput) => {
    if (!canUnlock) return
    unlock.mutate(data.password, {
      onSuccess: () => {
        form.reset()
        onUnlocked()
      },
    })
  }

  const handleRetryLock = () => {
    unlock.reset()
    onRetryLock()
  }

  const isPending = unlock.isPending || logout.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-disabled={!canUnlock || isPending} data-invalid={fieldState.invalid}>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="password"
                placeholder="Enter your password"
                autoFocus={canUnlock}
                autoComplete="current-password"
                disabled={!canUnlock || isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {lockError && (
          <Alert variant="destructive">
            <AlertDescription>{lockError}</AlertDescription>
          </Alert>
        )}
        {unlock.error && (
          <Alert variant="destructive">
            <AlertDescription>{unlock.error.message}</AlertDescription>
          </Alert>
        )}
      </FieldGroup>
      <AlertDialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => logout.mutate()}
          disabled={isPending}
        >
          {logout.isPending && <Spinner data-icon="inline-start" />}
          Sign Out
        </Button>
        {lockError ? (
          <Button type="button" onClick={handleRetryLock} disabled={isPending}>
            Retry Lock
          </Button>
        ) : (
          <Button type="submit" disabled={!canUnlock || isPending}>
            {!canUnlock || unlock.isPending ? <Spinner data-icon="inline-start" /> : null}
            {canUnlock ? "Unlock" : "Securing"}
          </Button>
        )}
      </AlertDialogFooter>
    </form>
  )
}
