'use client'

import { ChainIcon } from '@/components/chain/ChainIcon'

export interface ChainOption {
  chainId: number
  label: string
}

interface ChainFilterProps {
  chains: ChainOption[]
  selected: number | undefined
  onChange: (chainId: number | undefined) => void
  isLoading?: boolean
}

export function ChainFilter({ chains, selected, onChange, isLoading }: ChainFilterProps) {

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <div className="h-11 w-10 rounded-full bg-muted animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-24 rounded-full bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-col justify-center">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`w-9 h-9 px-1.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === undefined
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
      </div>

      {chains.map(({ chainId, label }) => {
        const isSelected = selected === chainId
        return (
          <button
            key={chainId}
            type="button"
            onClick={() => onChange(isSelected ? undefined : chainId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <ChainIcon chainId={chainId} size={16} label={label} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
