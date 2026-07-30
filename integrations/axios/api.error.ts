import { isAxiosError } from "axios"

interface ApiErrorDetails {
  status?: number
  code?: string
  method?: string
  url?: string
}

export class ApiRequestError extends Error {
  readonly name = "ApiRequestError"
  readonly status?: number
  readonly code?: string
  readonly method?: string
  readonly url?: string

  constructor(message: string, details: ApiErrorDetails = {}) {
    super(message)
    this.status = details.status
    this.code = details.code
    this.method = details.method
    this.url = details.url
  }
}

export class ApiResponseValidationError extends Error {
  readonly name = "ApiResponseValidationError"
  readonly code = "INVALID_API_RESPONSE"
  readonly issues: ReadonlyArray<{ path: string; message: string }>
  readonly method?: string
  readonly url?: string

  constructor(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
    details: Pick<ApiErrorDetails, "method" | "url"> = {}
  ) {
    super("API response did not match the expected schema.")
    this.issues = issues.map(issue => ({
      path: issue.path.map(String).join("."),
      message: issue.message,
    }))
    this.method = details.method
    this.url = details.url
  }
}

function getErrorPayload(data: unknown): { code?: string; message?: string } {
  if (!data || typeof data !== "object") return {}

  const payload = data as Record<string, unknown>

  return {
    ...(typeof payload.code === "string" ? { code: payload.code } : {}),
    ...(typeof payload.message === "string" ? { message: payload.message } : {}),
  }
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof ApiRequestError || error instanceof ApiResponseValidationError) {
    return error
  }

  if (!isAxiosError(error)) {
    return error instanceof Error ? error : new Error("Unknown API request failure.")
  }

  const payload = getErrorPayload(error.response?.data)

  return new ApiRequestError(payload.message ?? error.message, {
    status: error.response?.status,
    code: payload.code,
    method: error.config?.method?.toUpperCase(),
    url: error.config?.url,
  })
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (error instanceof ApiRequestError) return error.status
  if (isAxiosError(error)) return error.response?.status
}
