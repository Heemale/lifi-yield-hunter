import { storageGet, storageSet, storageRemove } from './storage'

const KEY = 'yield-hunter:vault-chain-filter'

export function loadChainFilter(): number | undefined {
  const val = storageGet<number | null>(KEY, null)
  return val ?? undefined
}

export function saveChainFilter(chainId: number): void {
  storageSet(KEY, chainId)
  // Dispatch storage event so same-page listeners can react
  window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: String(chainId) }))
}

export function clearChainFilter(): void {
  storageRemove(KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: null }))
}
