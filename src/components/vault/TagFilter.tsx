'use client'

import type { TagFilterValue } from '@/lib/vault/filters'

interface TagFilterProps {
  selected: TagFilterValue
  onChange: (tag: TagFilterValue) => void
}

const TAG_OPTIONS: { value: TagFilterValue; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'saved',       label: 'Saved' },
  { value: 'stablecoins', label: 'Stablecoins' },
  { value: 'single',      label: 'Single' },
  { value: 'lp',          label: 'LP' },
]

export function TagFilter({ selected, onChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAG_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={
            selected === value
              ? 'rounded-full px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground'
              : 'rounded-full px-4 py-1.5 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80'
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}
