import type { Vault } from '@/types'

export function rewardRatio(apy: Vault['analytics']['apy']): number {
  if (!apy.total || apy.total === 0) return 0
  return Math.round(((apy.reward ?? 0) / apy.total) * 100)
}

export function apyTrend(vault: Vault): 'up' | 'down' | 'stable' {
  const current = vault.analytics.apy.total
  const avg = vault.analytics.apy30d
  if (!avg) return 'stable'
  if (current > avg * 1.1) return 'up'
  if (current < avg * 0.9) return 'down'
  return 'stable'
}

export function formatUsd(value: string | number): string {
  const num = typeof value === 'string' ? Number(value) : value
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
  return `$${num.toFixed(2)}`
}

export function formatApy(value: number | null): string {
  if (value == null) return '—'
  return `${value.toFixed(2)}%`
}
