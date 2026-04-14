'use client'

import { ChainIcon } from '@/components/chain/ChainIcon'
import { ApyValue } from '@/components/vault/ApyValue'
import { TAG_LABELS, formatTvl } from '@/lib/vault/display'
import type { VaultSummary } from '@/lib/ai/earn-queries'

interface VaultCardProps {
  vault: VaultSummary
  showActions?: boolean
  onViewDetail?: (vault: VaultSummary) => void
}

export function VaultCard({ vault, onViewDetail }: VaultCardProps) {
  const tokenSymbols = vault.underlyingTokens.map(t => t.symbol).join(' + ')

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-base truncate">{tokenSymbols || vault.name}</span>
        <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
          <ChainIcon chainId={vault.chainId} size={16} />
          <span>{vault.network}</span>
        </div>
      </div>

      {vault.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vault.tags.map(tag => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {TAG_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{vault.protocol}</p>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-primary">{vault.apy.total.toFixed(2)}%</span>
        <span className="text-xs text-muted-foreground">年化</span>
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs">
        {([['1d', vault.apy1d], ['7d', vault.apy7d], ['30d', vault.apy30d]] as [string, number | null][]).map(([label, val]) => (
          <div key={label} className="flex flex-col items-center rounded-lg bg-muted/50 py-1.5">
            <span className="text-muted-foreground mb-0.5">{label}</span>
            <ApyValue value={val} />
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        TVL <span className="font-medium text-foreground">{formatTvl(vault.tvlUsd)}</span>
      </div>

      {onViewDetail && (
        <button
          className="text-xs text-primary underline underline-offset-2 hover:opacity-80 text-left"
          onClick={() => onViewDetail(vault)}
        >
          查看详情
        </button>
      )}
    </div>
  )
}
