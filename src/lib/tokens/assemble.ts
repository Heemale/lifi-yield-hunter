import type { Token } from '@lifi/sdk'
import type { PublicClient } from 'viem'
import type { TokenBalance } from '@/context/wallet/BalanceContext'
import { parseTokenBalance } from '@/context/wallet/BalanceContext'
import { fetchSingleToken } from '@/services/lifi/common'

export interface TokenWithBalance extends Token {
  amount: bigint
  formattedAmount: string
}

/** Match Alchemy balances against a metadata map, return matched tokens and missing addresses */
export function matchBalances(
  balances: TokenBalance[],
  metadataMap: Record<string, Token>
): { matched: TokenWithBalance[]; missingAddresses: string[] } {
  const matched: TokenWithBalance[] = []
  const missingAddresses: string[] = []

  for (const b of balances) {
    const amount = BigInt(b.tokenBalance)
    if (amount === BigInt(0)) continue

    const meta = metadataMap[b.contractAddress.toLowerCase()]
    if (meta) {
      matched.push({
        ...meta,
        amount,
        formattedAmount: parseTokenBalance(b.tokenBalance, meta.decimals),
      })
    } else {
      missingAddresses.push(b.contractAddress)
    }
  }

  return { matched, missingAddresses }
}

/** Fetch metadata for missing tokens individually, return assembled TokenWithBalance list */
export async function recoverMissingTokens(
  chainId: number,
  missingAddresses: string[],
  balances: TokenBalance[]
): Promise<TokenWithBalance[]> {
  const results = await Promise.all(
    missingAddresses.map(async addr => {
      const meta = await fetchSingleToken(chainId, addr)
      if (!meta) return null
      const b = balances.find(x => x.contractAddress.toLowerCase() === addr.toLowerCase())!
      const amount = BigInt(b.tokenBalance)
      return {
        ...meta,
        amount,
        formattedAmount: parseTokenBalance(b.tokenBalance, meta.decimals),
      } satisfies TokenWithBalance
    })
  )
  return results.filter((t): t is TokenWithBalance => t !== null)
}

/** Build native token entry using RPC balance and optional LiFi metadata for price/logo */
export async function buildNativeToken(
  chainId: number,
  walletAddress: string,
  publicClient: PublicClient,
  nativeMeta: Token | null
): Promise<TokenWithBalance | null> {
  const balance = await publicClient.getBalance({ address: walletAddress as `0x${string}` })
  if (balance === BigInt(0)) return null

  const chain = publicClient.chain
  if (!chain) return null
  const { nativeCurrency } = chain
  return {
    address: '0x0000000000000000000000000000000000000000',
    chainId,
    symbol: nativeCurrency.symbol,
    decimals: nativeCurrency.decimals,
    name: nativeCurrency.name,
    coinKey: nativeCurrency.symbol as never,
    logoURI: nativeMeta?.logoURI ?? '',
    priceUSD: nativeMeta?.priceUSD ?? '0',
    amount: balance,
    formattedAmount: parseTokenBalance('0x' + balance.toString(16), nativeCurrency.decimals),
  }
}

/** Sort tokens by USD value descending */
export function sortByUsdValue(tokens: TokenWithBalance[]): TokenWithBalance[] {
  return [...tokens].sort((a, b) => {
    const aUsd = parseFloat(a.priceUSD ?? '0') * parseFloat(a.formattedAmount)
    const bUsd = parseFloat(b.priceUSD ?? '0') * parseFloat(b.formattedAmount)
    return bUsd - aUsd
  })
}
