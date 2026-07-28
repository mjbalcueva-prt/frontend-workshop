import { isAxiosError } from "axios"

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) return error.response?.data?.message ?? error.message

  return "Something went wrong"
}
