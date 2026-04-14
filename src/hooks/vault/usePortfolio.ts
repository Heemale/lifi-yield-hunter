'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Position } from '@/types'

interface UsePortfolioResult {
  positions: Position[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function usePortfolio(address: string | undefined): UsePortfolioResult {
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!address) {
      setPositions([])
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/earn/portfolio/${address}`)
      .then(res => res.json())
      .then(({ positions: data }) => {
        if (!cancelled) setPositions(data ?? [])
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [address, tick])

  const refetch = useCallback(() => setTick(t => t + 1), [])

  return { positions, isLoading, error, refetch }
}
