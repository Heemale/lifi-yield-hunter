'use client'

import { ChainIcon } from '@/components/chain/ChainIcon'
import { formatUsd } from '@/utils/format'
import { getProtocolInfo } from '@/constants/protocols'
import type { Position } from '@/types'

interface PositionListProps {
  positions: Position[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

export function PositionList({ positions, isLoading, error, onRetry }: PositionListProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
        <p>{error.message || '加载失败，请重试'}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 h-20 bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        暂无持仓记录
      </div>
    )
  }

  const totalUsd = positions.reduce((s, p) => s + parseFloat(p.balanceUsd || '0'), 0)

  // Group by protocol
  const grouped = positions.reduce<Record<string, Position[]>>((acc, pos) => {
    const key = pos.protocolName
    if (!acc[key]) acc[key] = []
    acc[key].push(pos)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      {/* Total */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">总持仓价值</span>
        <span className="text-xl font-bold">{formatUsd(totalUsd)}</span>
      </div>

      {/* Protocol groups */}
      {Object.entries(grouped).map(([protocolName, positions]) => {
        const protocol = getProtocolInfo(protocolName)
        const groupTotal = positions.reduce((s, p) => s + parseFloat(p.balanceUsd || '0'), 0)
        const href = protocol.url

        return (
          <a
            key={protocolName}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            {/* Protocol header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{protocol.displayName}</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">↗</span>
              </div>
              <span className="font-semibold">{formatUsd(groupTotal)}</span>
            </div>

            {/* Positions in this protocol */}
            <div className="flex flex-col gap-2">
              {positions.map((pos, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChainIcon chainId={pos.chainId} size={14} />
                    <span>{pos.asset.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatUsd(parseFloat(pos.balanceUsd))}</div>
                    <div className="text-xs text-muted-foreground">
                      {parseFloat(pos.balanceNative).toFixed(4)} {pos.asset.symbol}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </a>
        )
      })}
    </div>
  )
}
