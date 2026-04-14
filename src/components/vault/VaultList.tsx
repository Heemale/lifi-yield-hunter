'use client'

import { useVaultList } from '@/hooks/vault/useVaultList'
import { useVaultAIActions } from '@/hooks/vault/useVaultAIActions'
import { FilterBar } from '@/components/vault/FilterBar'
import { VaultTable } from '@/components/vault/VaultTable'
import { StakeModal } from '@/components/transaction/stake'

export function VaultList() {
  const {
    chains, filteredVaults, favorites,
    isLoading, error,
    selectedChainId, selectedTag, searchQuery, sortConfig,
    handleChainChange, handleSortChange, handleToggleFavorite,
    onTagChange, onSearchChange, refetch,
    setSelectedChainId,
  } = useVaultList()

  const { stakeVault, stakeMode, handleStake, handleUnstake, onStakeClose } =
    useVaultAIActions(setSelectedChainId)

  return (
    <div className="flex flex-col gap-4 p-4">
      <FilterBar
        chains={chains}
        selectedChainId={selectedChainId}
        onChainChange={handleChainChange}
        selectedTag={selectedTag}
        onTagChange={onTagChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isLoading={isLoading}
      />
      <VaultTable
        vaults={filteredVaults}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onStake={handleStake}
        onUnstake={handleUnstake}
      />
      <StakeModal vault={stakeVault} mode={stakeMode} onClose={onStakeClose} />
    </div>
  )
}
