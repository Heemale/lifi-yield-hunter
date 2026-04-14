import { Star } from 'lucide-react'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFavorite ? '取消收藏' : '收藏'}
      className="p-1 rounded hover:bg-muted transition-colors"
    >
      <Star
        size={16}
        className={isFavorite ? 'text-yellow-400' : 'text-muted-foreground'}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  )
}
