'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAccount } from 'wagmi'

export interface TokenBalance {
  contractAddress: string
  tokenBalance: string // hex string
}

interface BalanceContextValue {
  balances: TokenBalance[]
  isLoading: boolean
  refresh: () => void
}

const BalanceContext = createContext<BalanceContextValue | null>(null)

const REFRESH_INTERVAL = 60_000 // 60s

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const { address, chainId } = useAccount()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tick, setTick] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!address || !chainId) { setBalances([]); return }

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/balances?address=${address}&chainId=${chainId}`,
        { signal: ctrl.signal }
      )
      const data = await res.json()
      if (!ctrl.signal.aborted) {
        setBalances(data?.result?.tokenBalances ?? [])
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') console.error('BalanceContext fetch failed:', e)
    } finally {
      if (!ctrl.signal.aborted) setIsLoading(false)
    }
  }, [address, chainId])

  // Fetch on address/chain change or manual refresh
  useEffect(() => {
    fetchBalances()
  }, [fetchBalances, tick])

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [])

  const refresh = useCallback(() => setTick(t => t + 1), [])

  return (
    <BalanceContext.Provider value={{ balances, isLoading, refresh }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalances() {
  const ctx = useContext(BalanceContext)
  if (!ctx) throw new Error('useBalances must be used within BalanceProvider')
  return ctx
}

/** Parse hex balance to decimal string */
export function parseTokenBalance(hexBalance: string, decimals: number): string {
  try {
    const raw = BigInt(hexBalance)
    if (raw === BigInt(0)) return '0'
    const divisor = BigInt(10 ** decimals)
    const whole = raw / divisor
    const frac = raw % divisor
    const fracStr = frac.toString().padStart(decimals, '0').slice(0, 6).replace(/0+$/, '')
    return fracStr ? `${whole}.${fracStr}` : `${whole}`
  } catch {
    return '0'
  }
}
