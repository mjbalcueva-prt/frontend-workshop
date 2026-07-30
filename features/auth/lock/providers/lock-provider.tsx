"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { useIdleTimer, type IIdleTimer } from "react-idle-timer"

import { useLock } from "@/features/auth/lock/lib/lock.mutation"

interface Props {
  children: ReactNode
  initiallyLocked?: boolean
}

export type LockPhase = "active" | "prompted" | "locking" | "locked" | "error"

type LockMessage =
  | { type: "locking" }
  | { type: "locked" }
  | { type: "lock-error"; error: string }
  | { type: "unlocked" }

interface LockContextValue {
  phase: LockPhase
  lockError: string | null
  lockGracePeriod: number
  getRemainingTime: () => number
  retryLock: () => void
  activateSession: () => void
}

const LockContext = createContext<LockContextValue | null>(null)

const LOCK_TIMER_NAME = "session-lock:v1"

/** Workshop-friendly timeouts. Raise these values for production. */
// const IDLE_TIMEOUT = 60 * 60 * 1000 // 60 mins
// const LOCK_GRACE_PERIOD = 15 * 60 * 1000 // 15 mins
const IDLE_TIMEOUT = 10 * 1000
const LOCK_GRACE_PERIOD = 5 * 1000

export function LockProvider({ children, initiallyLocked = false }: Props) {
  const initialPhase = initiallyLocked ? "locked" : "active"
  const [phase, setPhase] = useState<LockPhase>(initialPhase)
  const [lockError, setLockError] = useState<string | null>(null)
  const phaseRef = useRef<LockPhase>(initialPhase)
  const { mutate: lockSession } = useLock()

  const updatePhase = useCallback((nextPhase: LockPhase) => {
    phaseRef.current = nextPhase
    setPhase(nextPhase)
  }, [])

  const performLock = useCallback(
    (idleTimer: IIdleTimer) => {
      if (phaseRef.current === "locking" || phaseRef.current === "locked") return

      updatePhase("locking")
      setLockError(null)
      idleTimer.message({ type: "locking" } satisfies LockMessage)

      lockSession(undefined, {
        onError: error => {
          setLockError(error.message)
          updatePhase("error")
          idleTimer.message({ type: "lock-error", error: error.message } satisfies LockMessage)
        },
        onSuccess: () => {
          updatePhase("locked")
          idleTimer.message({ type: "locked" } satisfies LockMessage)
        },
      })
    },
    [lockSession, updatePhase]
  )

  const onPrompt = useCallback(() => {
    if (phaseRef.current === "active") updatePhase("prompted")
  }, [updatePhase])

  const onActive = useCallback(() => {
    if (phaseRef.current === "prompted") updatePhase("active")
  }, [updatePhase])

  const onIdle = useCallback(
    (_event?: Event, idleTimer?: IIdleTimer) => {
      if (!idleTimer || (phaseRef.current !== "active" && phaseRef.current !== "prompted")) {
        return
      }

      if (idleTimer.isLeader()) {
        performLock(idleTimer)
        return
      }

      setLockError(null)
      updatePhase("locking")
    },
    [performLock, updatePhase]
  )

  const onMessage = useCallback(
    (message: LockMessage) => {
      setLockError(message.type === "lock-error" ? message.error : null)

      if (message.type === "lock-error") {
        updatePhase("error")
        return
      }

      updatePhase(message.type === "unlocked" ? "active" : message.type)
    },
    [updatePhase]
  )

  const idleTimer = useIdleTimer({
    name: LOCK_TIMER_NAME,
    timeout: IDLE_TIMEOUT + LOCK_GRACE_PERIOD,
    promptBeforeIdle: LOCK_GRACE_PERIOD,
    crossTab: true,
    leaderElection: true,
    syncTimers: 1000,
    startManually: initiallyLocked,
    stopOnIdle: true,
    eventsThrottle: 500,
    onPrompt,
    onIdle,
    onActive,
    onMessage,
  })

  const activateSession = useCallback(() => {
    setLockError(null)
    updatePhase("active")
    idleTimer.activate()
    idleTimer.message({ type: "unlocked" } satisfies LockMessage)
  }, [idleTimer, updatePhase])

  const retryLock = useCallback(() => {
    performLock(idleTimer)
  }, [idleTimer, performLock])

  const value = useMemo<LockContextValue>(
    () => ({
      phase,
      lockError,
      lockGracePeriod: LOCK_GRACE_PERIOD,
      getRemainingTime: idleTimer.getRemainingTime,
      retryLock,
      activateSession,
    }),
    [activateSession, idleTimer.getRemainingTime, lockError, phase, retryLock]
  )

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>
}

export function useLockSession(): LockContextValue {
  const context = useContext(LockContext)

  if (!context) {
    throw new Error("useLockSession must be used within a LockProvider")
  }

  return context
}
