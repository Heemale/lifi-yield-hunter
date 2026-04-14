'use client'

import { useState, useEffect } from 'react'
import type { VaultSummary } from '@/lib/ai/earn-queries'

export function useVaultAIActions(setSelectedChainId: (chainId: number | undefined) => void) {
  const [stakeVault, setStakeVault] = useState<VaultSummary | null>(null)
  const [stakeMode, setStakeMode] = useState<'stake' | 'unstake'>('stake')

  // Listen for AI-triggered chain filter changes via localStorage
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'yield-hunter:vault-chain-filter') {
        setSelectedChainId(e.newValue ? Number(e.newValue) : undefined)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [setSelectedChainId])

  const handleStake = (vault: VaultSummary) => { setStakeMode('stake'); setStakeVault(vault) }
  const handleUnstake = (vault: VaultSummary) => { setStakeMode('unstake'); setStakeVault(vault) }

  return { stakeVault, stakeMode, handleStake, handleUnstake, onStakeClose: () => setStakeVault(null) }
}
