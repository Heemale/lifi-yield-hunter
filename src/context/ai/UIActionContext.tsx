'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { VaultSummary } from '@/lib/ai/earn-queries'

export interface PendingStake {
  vault: VaultSummary
  mode: 'stake' | 'unstake'
}

interface UIActionContextValue {
  pendingStake: PendingStake | null
  setPendingStake: (stake: PendingStake | null) => void
  clearPendingActions: () => void
}

const UIActionContext = createContext<UIActionContextValue | null>(null)

export function UIActionProvider({ children }: { children: React.ReactNode }) {
  const [pendingStake, setPendingStake] = useState<PendingStake | null>(null)

  const clearPendingActions = useCallback(() => {
    setPendingStake(null)
  }, [])

  return (
    <UIActionContext.Provider value={{ pendingStake, setPendingStake, clearPendingActions }}>
      {children}
    </UIActionContext.Provider>
  )
}

export function useUIAction() {
  const ctx = useContext(UIActionContext)
  if (!ctx) throw new Error('useUIAction must be used within UIActionProvider')
  return ctx
}
