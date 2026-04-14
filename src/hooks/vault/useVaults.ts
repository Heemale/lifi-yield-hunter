'use client'

import { useState, useEffect, useCallback } from 'react'
import { calcRiskTag } from '@/lib/vault/risk'
import { sortByApy, filterByChain, filterByRewardRatio } from '@/lib/vault/filters'
import type { Vault } from '@/types'

interface UseVaultsOptions {
  chainId?: number
  minRewardRatio?: number
  asset?: string
}

interface UseVaultsResult {
  vaults: VaultSummary[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useVaults(options: UseVaultsOptions = {}): UseVaultsResult {
  const { chainId, minRewardRatio = 0, asset } = options

  const [allVaults, setAllVaults] = useState<VaultSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (asset) params.set('asset', asset)

    fetch(`/api/earn/vaults?${params.toString()}`)
      .then(res => res.json())
      .then(({ data }) => {
        if (cancelled) return
        const mapped: VaultSummary[] = data
          .filter((v: Vault) => v.isTransactional)
          .map((v: Vault) => {
            const tvlUsd = Number(v.analytics.tvl.usd)
            return {
              name: v.name,
              protocol: v.protocol.name,
              network: v.network,
              chainId: v.chainId,
              address: v.address,
              apy: {
                total: v.analytics.apy.total,
                base: v.analytics.apy.base,
                reward: v.analytics.apy.reward ?? 0,
                rewardRatio:
                  v.analytics.apy.total > 0
                    ? Math.round(((v.analytics.apy.reward ?? 0) / v.analytics.apy.total) * 1000) / 10
                    : 0,
              },
              apy1d: v.analytics.apy1d,
              apy7d: v.analytics.apy7d,
              apy30d: v.analytics.apy30d,
              tvlUsd,
              tags: v.tags,
              isRedeemable: v.isRedeemable,
              isTransactional: v.isTransactional,
              riskTag: calcRiskTag(tvlUsd, v.tags),
              underlyingTokens: v.underlyingTokens,
            }
          })
        setAllVaults(mapped)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [tick, asset])

  const refetch = useCallback(() => setTick(t => t + 1), [])

  const vaults = sortByApy(
    filterByRewardRatio(
      filterByChain(allVaults, chainId),
      minRewardRatio
    )
  )

  return { vaults, isLoading, error, refetch }
}

import type { VaultSummary } from '@/lib/ai/earn-queries'
