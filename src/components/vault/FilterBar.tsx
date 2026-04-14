'use client'

import { ChainFilter, type ChainOption } from '@/components/vault/ChainFilter'
import { TagFilter } from '@/components/vault/TagFilter'
import type { TagFilterValue } from '@/lib/vault/filters'

interface FilterBarProps {
  chains: ChainOption[]
  selectedChainId: number | undefined
  onChainChange: (chainId: number | undefined) => void
  selectedTag: TagFilterValue
  onTagChange: (tag: TagFilterValue) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  isLoading?: boolean
}

export function FilterBar({
  chains,
  selectedChainId,
  onChainChange,
  selectedTag,
  onTagChange,
  searchQuery,
  onSearchChange,
  isLoading,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="按 Token 符号或地址搜索..."
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <ChainFilter chains={chains} selected={selectedChainId} onChange={onChainChange} isLoading={isLoading} />
      <TagFilter selected={selectedTag} onChange={onTagChange} />
    </div>
  )
}
