import type { Token } from '@lifi/sdk'
import { storageGet, storageSet } from './storage'

const STORAGE_PREFIX = 'yield-hunter:token-metadata:'

// address (lowercase) → Token
type TokenMetadataStore = Record<string, Token>

function storageKey(chainId: number): string {
  return `${STORAGE_PREFIX}${chainId}`
}

export function loadTokenMetadata(chainId: number): TokenMetadataStore | null {
  return storageGet<TokenMetadataStore | null>(storageKey(chainId), null)
}

export function saveTokenMetadata(chainId: number, tokens: Token[]): void {
  const map: TokenMetadataStore = {}
  for (const t of tokens) map[t.address.toLowerCase()] = t
  storageSet(storageKey(chainId), map)
}

export function saveOneTokenMetadata(chainId: number, token: Token): void {
  const existing = loadTokenMetadata(chainId) ?? {}
  existing[token.address.toLowerCase()] = token
  storageSet(storageKey(chainId), existing)
}

export function findTokenMetadata(chainId: number, address: string): Token | null {
  const store = loadTokenMetadata(chainId)
  if (!store) return null
  return store[address.toLowerCase()] ?? null
}
