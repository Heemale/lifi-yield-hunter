import type { VaultSummary } from '@/lib/ai/earn-queries'

/**
 * Sorts vaults by total APY in descending order (highest first).
 * Returns a new array without mutating the input.
 */
export function sortByApy(vaults: VaultSummary[]): VaultSummary[] {
  return [...vaults].sort((a, b) => b.apy.total - a.apy.total)
}

/**
 * Filters vaults by chainId.
 * If chainId is undefined, returns all vaults.
 */
export function filterByChain(
  vaults: VaultSummary[],
  chainId: number | undefined
): VaultSummary[] {
  if (chainId === undefined) return vaults
  return vaults.filter(v => v.chainId === chainId)
}

/**
 * Filters vaults by minimum RewardRatio threshold.
 * Only returns vaults where apy.rewardRatio >= minRatio.
 * minRatio is a percentage value (0–100).
 */
export function filterByRewardRatio(
  vaults: VaultSummary[],
  minRatio: number
): VaultSummary[] {
  return vaults.filter(v => v.apy.rewardRatio >= minRatio)
}

// ─── New types ────────────────────────────────────────────────────────────────

export type TagFilterValue = 'all' | 'saved' | 'stablecoins' | 'single' | 'lp'
export type SortKey = 'tvlUsd' | 'apy'

export interface SortConfig {
  key: SortKey
  dir: 'asc' | 'desc'
}

export interface FilterState {
  chainId: number | undefined
  tag: TagFilterValue
  searchQuery: string
  sortConfig: SortConfig
}

// ─── New filter / sort functions ──────────────────────────────────────────────

/**
 * Filters vaults by tag type.
 * 'all'        → returns all vaults
 * 'saved'      → returns vaults whose `${chainId}:${address}` is in favorites
 * 'stablecoins'→ returns vaults whose tags include 'stablecoin'
 * 'single'     → returns vaults whose tags include 'single'
 * 'lp'         → returns vaults whose tags include 'lp'
 */
export function filterByTag(
  vaults: VaultSummary[],
  tag: TagFilterValue,
  favorites: Set<string>
): VaultSummary[] {
  switch (tag) {
    case 'all':
      return vaults
    case 'saved':
      return vaults.filter(v => favorites.has(`${v.chainId}:${v.address}`))
    case 'stablecoins':
      return vaults.filter(v => v.tags.includes('stablecoin'))
    case 'single':
      return vaults.filter(v => v.tags.includes('single'))
    case 'lp':
      return vaults.filter(v => v.tags.includes('lp'))
    default:
      return vaults
  }
}

/**
 * Filters vaults by a search query (case-insensitive).
 * Matches against vault name or any underlyingTokens[].symbol.
 * An empty / whitespace-only query returns the full list.
 */
export function filterBySearch(vaults: VaultSummary[], query: string): VaultSummary[] {
  if (!query.trim()) return vaults
  const q = query.toLowerCase()
  return vaults.filter(
    v =>
      v.name.toLowerCase().includes(q) ||
      v.underlyingTokens.some(t => t.symbol.toLowerCase().includes(q))
  )
}

/**
 * Sorts vaults by the given key and direction.
 * Returns a new array without mutating the input.
 */
export function sortVaults(vaults: VaultSummary[], config: SortConfig): VaultSummary[] {
  return [...vaults].sort((a, b) => {
    const aVal = config.key === 'tvlUsd' ? a.tvlUsd : a.apy.total
    const bVal = config.key === 'tvlUsd' ? b.tvlUsd : b.apy.total
    return config.dir === 'desc' ? bVal - aVal : aVal - bVal
  })
}

/**
 * Applies all filters and sorting in sequence (AND semantics):
 *   filterByChain → filterByTag → filterBySearch → sortVaults
 */
export function applyFilters(
  vaults: VaultSummary[],
  state: FilterState,
  favorites: Set<string>
): VaultSummary[] {
  return sortVaults(
    filterBySearch(
      filterByTag(filterByChain(vaults, state.chainId), state.tag, favorites),
      state.searchQuery
    ),
    state.sortConfig
  )
}
