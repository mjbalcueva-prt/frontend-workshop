import { AxiosError } from "axios"

type ValidationErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

/** Extract a user-friendly message from an Axios error response body. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ValidationErrorBody | undefined
    if (body?.errors) {
      return Object.values(body.errors).flat()[0] ?? error.message
    }
    return body?.message ?? error.message
  }
  return error instanceof Error ? error.message : "Something went wrong"
}
