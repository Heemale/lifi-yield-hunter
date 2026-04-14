import type { Token } from '@lifi/sdk'
import { commonApi } from '@/lib/axios'
import { saveTokenMetadata, saveOneTokenMetadata } from '@/store/tokenMetadata'

/** Fetch all tokens for a chain from LiFi and persist to localStorage */
export async function fetchAndCacheTokens(chainId: number): Promise<Token[]> {
  try {
    const { data } = await commonApi.get('/v1/tokens', { params: { chains: chainId } })
    const tokens: Token[] = data.tokens?.[chainId] ?? []
    saveTokenMetadata(chainId, tokens)
    return tokens
  } catch (e) {
    console.error('fetchAndCacheTokens failed:', e)
    return []
  }
}

/** Fetch a single token's metadata from LiFi and persist to localStorage */
export async function fetchSingleToken(chainId: number, address: string): Promise<Token | null> {
  try {
    const { data } = await commonApi.get('/v1/token', { params: { chain: chainId, token: address } })
    const token = data as Token
    saveOneTokenMetadata(chainId, token)
    return token
  } catch {
    return null
  }
}
