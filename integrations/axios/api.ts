import "server-only"

import { cache } from "react" // ← add this

import axios from "axios"

import { getAuthToken } from "@/features/auth/_utils/auth.cookie"

import { env } from "@/env"

export const createApiClient = cache(async () => {
  const token = await getAuthToken()

  return axios.create({
    baseURL: env.API_URL,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    validateStatus: () => true,
  })
})
