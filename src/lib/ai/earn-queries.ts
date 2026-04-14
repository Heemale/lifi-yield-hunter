import { getVaults, getPortfolio } from '@/services/lifi/earn'
import type { VaultFilters, VaultToken, Position } from '@/types'
import { calcRiskTag } from '@/lib/vault/risk'

export interface VaultSummary {
  name: string
  protocol: string
  network: string
  chainId: number
  address: string
  apy: { total: number; base: number; reward: number; rewardRatio: number }
  apy1d: number | null
  apy7d: number | null
  apy30d: number | null
  tvlUsd: number
  tags: string[]
  isRedeemable: boolean
  isTransactional: boolean
  riskTag: 'low' | 'medium' | 'high'
  underlyingTokens: VaultToken[]
}

export async function getTopVaults(filters?: VaultFilters & { limit?: number }): Promise<{ vaults: VaultSummary[]; total: number }> {
  const { data, total } = await getVaults(filters)
  const vaults = data
    .filter(v => v.isTransactional)
    .slice(0, filters?.limit ?? 10)
    .map(v => {
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
          rewardRatio: v.analytics.apy.total > 0
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
  return { vaults, total }
}

export async function getUserPortfolio(address: string): Promise<{ positions: Position[] }> {
  return getPortfolio(address)
}
