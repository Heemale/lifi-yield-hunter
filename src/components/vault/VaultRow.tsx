import type { VaultSummary } from '@/lib/ai/earn-queries'
import { useState } from 'react'
import Link from 'next/link'
import { ChainIcon } from '@/components/chain/ChainIcon'
import { FavoriteButton } from '@/components/vault/FavoriteButton'
import { Button } from '@/components/ui/button'
import { formatUsd, formatApy } from '@/utils/format'

interface VaultRowProps {
  vault: VaultSummary & { score: number }
  isFavorite: boolean
  onToggleFavorite: () => void
  onStake?: (vault: VaultSummary) => void
  onUnstake?: (vault: VaultSummary) => void
}

export function VaultRow({ vault, isFavorite, onToggleFavorite, onStake }: VaultRowProps) {
  const tokenSymbols = vault.underlyingTokens.map(t => t.symbol).join('/')
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(vault.address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </td>
      <td className="flex gap-3 px-4 py-3 w-40 max-w-40">
        <div className='flex'>
          <button onClick={handleCopy} title={vault.address} className="mt-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {copied ? '✓' : '⎘'}
          </button>
        </div>
        <div>
          <div className="font-medium text-sm truncate">{vault.name}</div>
          {tokenSymbols && <div className="text-xs text-muted-foreground truncate">{tokenSymbols}</div>}
        </div>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">{vault.protocol}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="group relative flex items-center">
          <ChainIcon chainId={vault.chainId} size={20} label={vault.network} />
          <span className="absolute left-7 z-10 hidden group-hover:block bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
            {vault.network}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">{formatUsd(vault.tvlUsd)}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">{formatApy(vault.apy.total)}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{vault.apy1d != null ? formatApy(vault.apy1d) : '--'}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{vault.apy7d != null ? formatApy(vault.apy7d) : '--'}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{vault.apy30d != null ? formatApy(vault.apy30d) : '--'}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap font-medium">{vault.score}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" disabled={!vault.isTransactional} onClick={() => onStake?.(vault)}>
            Stake
          </Button>
          <Link href={`/vaults/${vault.chainId}/${vault.address}`} className="ml-1 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            →
          </Link>
        </div>
      </td>
    </tr>
  )
}
