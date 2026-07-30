"use client"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Alert, AlertDescription } from "@/core/components/reui/alert"
import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"
import { withCallbackUrl } from "@/core/proxy/url"

import { useLogin } from "../lib/login.mutation"
import { loginSchema, type LoginInput } from "../lib/login.schema"

export function AuthLoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const login = useLogin()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  })

  const onSubmit = (data: LoginInput) => login.mutate({ input: data, callbackUrl })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="remember"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
                  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
                </Field>
              )}
            />

            {login.error && (
              <Alert variant="destructive">
                <AlertDescription>{login.error.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending && <Spinner data-icon="inline-start" />}
              Sign in
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              Don&apos;t have an account?{" "}
              <Link
                href={withCallbackUrl("/register", callbackUrl ?? "/")}
                className="text-foreground underline underline-offset-2"
              >
                Register
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
