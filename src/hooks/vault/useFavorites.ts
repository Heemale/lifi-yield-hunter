import { useState, useEffect, useCallback } from 'react'
import { loadFavorites, saveFavorites, vaultId } from '@/store/favorites'

interface UseFavoritesResult {
  favorites: Set<string>
  isFavorite: (chainId: number, address: string) => boolean
  toggleFavorite: (chainId: number, address: string) => void
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const isFavorite = useCallback(
    (chainId: number, address: string) => favorites.has(vaultId(chainId, address)),
    [favorites]
  )

  const toggleFavorite = useCallback((chainId: number, address: string) => {
    const id = vaultId(chainId, address)
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
