import "server-only"

import type { AxiosInstance, AxiosResponse } from "axios"
import type { z } from "zod"

import {
  redirectToLogin,
  redirectToUnlock,
  requireUnlockedSession,
} from "@/features/auth/user/lib/session.guard"

import { createApiClient } from "./api"
import { ApiResponseValidationError, getApiErrorStatus, normalizeApiError } from "./api.error"

type MaybePromise<T> = T | Promise<T>
type ProtectedRequest = (api: AxiosInstance) => Promise<AxiosResponse<unknown>>

interface ParsedResponseOptions<TSchema extends z.ZodType> {
  schema: TSchema
}

interface TransformedResponseOptions<
  TSchema extends z.ZodType,
  TResult,
> extends ParsedResponseOptions<TSchema> {
  transform: (data: z.output<TSchema>, response: AxiosResponse<unknown>) => MaybePromise<TResult>
}

export function protectedFetch(request: ProtectedRequest): Promise<void>

export function protectedFetch<TSchema extends z.ZodType>(
  request: ProtectedRequest,
  options: ParsedResponseOptions<TSchema>
): Promise<z.output<TSchema>>

export function protectedFetch<TSchema extends z.ZodType, TResult>(
  request: ProtectedRequest,
  options: TransformedResponseOptions<TSchema, TResult>
): Promise<TResult>

export async function protectedFetch<TSchema extends z.ZodType, TResult>(
  request: ProtectedRequest,
  options?: ParsedResponseOptions<TSchema> | TransformedResponseOptions<TSchema, TResult>
): Promise<void | z.output<TSchema> | TResult> {
  await requireUnlockedSession()

  const api = await createApiClient()
  const outcome = await request(api).then(
    response => ({ ok: true, response }) as const,
    error => ({ ok: false, error }) as const
  )

  if (!outcome.ok) {
    const status = getApiErrorStatus(outcome.error)

    if (status === 401) return redirectToLogin()
    if (status === 423) return redirectToUnlock()

    throw normalizeApiError(outcome.error)
  }

  if (!options) return

  const parsed = options.schema.safeParse(outcome.response.data)

  if (!parsed.success) {
    throw new ApiResponseValidationError(parsed.error.issues, {
      method: outcome.response.config.method?.toUpperCase(),
      url: outcome.response.config.url,
    })
  }

  if ("transform" in options) {
    return options.transform(parsed.data, outcome.response)
  }

  return parsed.data
}
