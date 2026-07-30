"use client"

import { useEffect, useState } from "react"

import { useLockSession } from "@/features/auth/lock/providers/lock-provider"

import { Badge } from "@/core/components/reui/badge"

/**
 * Purely visual countdown badge. The lock system works independently —
 * this component can be removed in production without affecting anything.
 */
export function LockTimer() {
  const { phase, lockGracePeriod, getRemainingTime } = useLockSession()
  const [remaining, setRemaining] = useState(() => getRemainingTime())

  useEffect(() => {
    if (phase !== "active" && phase !== "prompted") return

    const tick = () => setRemaining(getRemainingTime())
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [getRemainingTime, phase])

  if (phase !== "active" && phase !== "prompted") return null

  const isPrompted = phase === "prompted"
  const effectiveRemaining = isPrompted ? remaining : Math.max(0, remaining - lockGracePeriod)
  const progress = isPrompted && lockGracePeriod > 0 ? remaining / lockGracePeriod : 1

  const seconds = Math.ceil(effectiveRemaining / 1000)
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  const variant = !isPrompted ? "success" : progress > 0.5 ? "warning" : "destructive"
  const label = isPrompted ? "until lock" : "until idle"

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Badge variant={variant} size="xl" radius="full" className="gap-1.5 font-mono shadow-lg">
        <span className="tabular-nums">
          {minutes}:{secs.toString().padStart(2, "0")}
        </span>
        <span className="font-medium opacity-75">{label}</span>
      </Badge>
    </div>
  )
}
