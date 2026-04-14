'use client'

import { useState, useEffect, useRef } from 'react'
import { usePublicClient } from 'wagmi'
import { loadTokenMetadata, findTokenMetadata } from '@/store/tokenMetadata'
import { fetchAndCacheTokens } from '@/services/lifi/common'
import { useBalances } from '@/context/wallet/BalanceContext'
import {
  matchBalances,
  recoverMissingTokens,
  buildNativeToken,
  sortByUsdValue,
} from '@/lib/tokens/assemble'

export type { TokenWithBalance } from '@/lib/tokens/assemble'

export function useTokenBalances(chainId: number | undefined, walletAddress: string | undefined) {
  const [tokens, setTokens] = useState<import('@/lib/tokens/assemble').TokenWithBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { balances, isLoading: isBalanceLoading } = useBalances()
  const publicClient = usePublicClient({ chainId })
  const fetchingChain = useRef<number | null>(null)

  useEffect(() => {
    if (!chainId || !walletAddress || !publicClient) { setTokens([]); return }

    let cancelled = false
    setIsLoading(true)

    async function load() {
      try {
        // 1. Metadata: local cache first, fetch from LiFi if empty
        let metadataMap = loadTokenMetadata(chainId!)
        if (!metadataMap && fetchingChain.current !== chainId) {
          fetchingChain.current = chainId!
          const fetched = await fetchAndCacheTokens(chainId!)
          fetchingChain.current = null
          metadataMap = Object.fromEntries(fetched.map(t => [t.address.toLowerCase(), t]))
        }
        metadataMap = metadataMap ?? {}

        // 2. Match balances, recover missing
        const { matched, missingAddresses } = matchBalances(balances, metadataMap)
        const recovered = await recoverMissingTokens(chainId!, missingAddresses, balances)

        // 3. Native token
        const nativeMeta = findTokenMetadata(chainId!, '0x0000000000000000000000000000000000000000')
        const native = await buildNativeToken(chainId!, walletAddress!, publicClient!, nativeMeta)

        if (cancelled) return

        setTokens(sortByUsdValue([
          ...(native ? [native] : []),
          ...matched,
          ...recovered,
        ]))
      } catch (e) {
        console.error('useTokenBalances failed:', e)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [chainId, walletAddress, balances, publicClient])

  return { tokens, isLoading: isLoading || isBalanceLoading }
}
