import { storageGet, storageSet } from './storage'

const KEY = 'yield-hunter:vault-favorites'

export function vaultId(chainId: number, address: string): string {
  return `${chainId}:${address}`
}

export function loadFavorites(): Set<string> {
  return new Set(storageGet<string[]>(KEY, []))
}

export function saveFavorites(favorites: Set<string>): void {
  storageSet(KEY, [...favorites])
}
