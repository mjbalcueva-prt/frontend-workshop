import "server-only"

import { cache } from "react"

import axios, { type AxiosResponse } from "axios"

import { getAuthToken } from "@/features/auth/_utils/auth.cookie"

import { env } from "@/env"

/** Simulate network latency: 100–500ms random delay */
async function simulateLatency(response: AxiosResponse): Promise<AxiosResponse> {
  const delay = Math.floor(Math.random() * 400) + 100
  await new Promise(resolve => setTimeout(resolve, delay))
  return response
}

export const createApiClient = cache(async () => {
  const token = await getAuthToken()

  const client = axios.create({
    baseURL: env.API_URL,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    validateStatus: () => true,
  })

  if (env.NODE_ENV === "development") {
    client.interceptors.response.use(simulateLatency)
  }

  return client
})
