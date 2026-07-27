"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useAuth } from "@/features/auth/user/providers/auth-provider"

import { Alert, AlertDescription } from "@/core/components/reui/alert"
import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"

import { useUpdateAccount } from "../lib/account.mutation"
import { accountSchema, type AccountInput } from "../lib/account.schema"

export function AccountUpdateForm() {
  const user = useAuth()
  const update = useUpdateAccount()

  const form = useForm<AccountInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: user.name },
  })

  const onSubmit = (data: AccountInput) => update.mutate(data)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    autoComplete="name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field data-disabled>
              <FieldLabel>Email</FieldLabel>
              <Input value={user.email} disabled />
            </Field>

            {update.error && (
              <Alert variant="destructive">
                <AlertDescription>{update.error.message}</AlertDescription>
              </Alert>
            )}
            {update.isSuccess && (
              <Alert variant="success">
                <AlertDescription>Profile updated.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={update.isPending} className="w-full">
              {update.isPending && <Spinner data-icon="inline-start" />}
              Save changes
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
