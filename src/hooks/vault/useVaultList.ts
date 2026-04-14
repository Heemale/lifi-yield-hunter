'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useVaults } from '@/hooks/vault/useVaults'
import { useFavorites } from '@/hooks/vault/useFavorites'
import { calcScores } from '@/lib/vault/score'
import { applyFilters, type TagFilterValue, type SortConfig, type SortKey } from '@/lib/vault/filters'
import { type ChainOption } from '@/components/vault/ChainFilter'
import { loadChainFilter, saveChainFilter, clearChainFilter } from '@/store/vaultFilters'
import type { VaultSummary } from '@/lib/ai/earn-queries'

export function useVaultList() {
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(loadChainFilter)
  const [selectedTag, setSelectedTag] = useState<TagFilterValue>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'apy', dir: 'desc' })
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { vaults: rawVaults, isLoading, error, refetch } = useVaults({ asset: debouncedQuery || undefined })
  const { favorites, toggleFavorite } = useFavorites()

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Derive unique chain options from the full vault list
  const chains = useMemo<ChainOption[]>(() => {
    const seen = new Map<number, string>()
    for (const vault of rawVaults) {
      if (!seen.has(vault.chainId)) seen.set(vault.chainId, vault.network)
    }
    return Array.from(seen.entries()).map(([chainId, label]) => ({ chainId, label }))
  }, [rawVaults])

  const filteredVaults = useMemo(
    () => applyFilters(
      calcScores(rawVaults),
      { chainId: selectedChainId, tag: selectedTag, searchQuery: '', sortConfig },
      favorites
    ) as (VaultSummary & { score: number })[],
    [rawVaults, selectedChainId, selectedTag, sortConfig, favorites]
  )

  const handleChainChange = useCallback((chainId: number | undefined) => {
    setSelectedChainId(chainId)
    if (chainId === undefined) clearChainFilter()
    else saveChainFilter(chainId)
  }, [])

  const handleSortChange = useCallback((key: SortKey) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' }
    )
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    const [chainIdStr, address] = id.split(':')
    toggleFavorite(Number(chainIdStr), address)
  }, [toggleFavorite])

  return {
    // data
    chains, filteredVaults, favorites,
    isLoading, error,
    // filter state
    selectedChainId, selectedTag, searchQuery, sortConfig,
    // handlers
    handleChainChange, handleSortChange, handleToggleFavorite,
    onTagChange: setSelectedTag,
    onSearchChange: setSearchQuery,
    refetch,
    // expose setter for AI actions
    setSelectedChainId,
  }
}
