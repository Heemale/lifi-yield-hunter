'use client'

import type { UIMessage } from 'ai'
import { Markdown } from '@/components/ui/markdown'
import { VaultCard } from '@/components/vault/VaultCard'
import type { VaultSummary } from '@/lib/ai/earn-queries'
import { stripActions, parseActions, ACTION_KEYS } from '@/lib/ai/actions'

interface MessageBubbleProps {
  message: UIMessage
  onStake?: (vault: VaultSummary) => void
}

export function MessageBubble({ message, onStake }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  const hasVaultResults = message.parts.some(
    p => p.type === 'tool-result' && (p as { toolName?: string }).toolName === 'getVaults'
  )

  // Extract stake recommendation from this message's text parts
  const stakeRecommendation: VaultSummary | null = (() => {
    if (isUser) return null
    for (const part of message.parts) {
      if (part.type !== 'text') continue
      const actions = parseActions(part.text)
      for (const { key, value } of actions) {
        if (key === ACTION_KEYS.STAKE_MODAL) {
          try { return JSON.parse(value) as VaultSummary } catch { /* ignore */ }
        }
      }
    }
    return null
  })()

  if (hasVaultResults) {
    return (
      <div className="space-y-2">
        {message.parts.map((part, i) => {
          if (part.type === 'text' && part.text.trim()) {
            return (
              <div key={i} className="text-sm rounded-xl px-3 py-2 bg-muted text-foreground mr-8 break-words overflow-hidden">
                <Markdown>{stripActions(part.text)}</Markdown>
              </div>
            )
          }
          if (part.type === 'tool-result' && (part as { toolName?: string }).toolName === 'getVaults') {
            const vaults = (part as { result?: { vaults?: VaultSummary[] } }).result?.vaults ?? []
            return (
              <div key={i} className="space-y-2">
                {vaults.map((vault, vi) => (
                  <VaultCard key={vault.address ?? vi} vault={vault} />
                ))}
              </div>
            )
          }
          return null
        })}
        {stakeRecommendation && onStake && (
          <StakeCard vault={stakeRecommendation} onStake={onStake} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className={`text-sm rounded-xl px-3 py-2 break-words overflow-hidden ${
        isUser ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted text-foreground mr-8'
      }`}>
        {message.parts.map((part, i) => {
          if (part.type === 'text') return <Markdown key={i}>{stripActions(part.text)}</Markdown>
          if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
            const name = part.type === 'dynamic-tool'
              ? (part as { toolName?: string }).toolName ?? 'tool'
              : part.type.replace('tool-', '')
            return <span key={i} className="text-xs opacity-50 italic block">[查询: {name}]</span>
          }
          return null
        })}
      </div>
      {stakeRecommendation && onStake && (
        <StakeCard vault={stakeRecommendation} onStake={onStake} />
      )}
    </div>
  )
}

function StakeCard({ vault, onStake }: { vault: VaultSummary; onStake: (v: VaultSummary) => void }) {
  return (
    <button
      type="button"
      onClick={() => onStake(vault)}
      className="w-full mr-8 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors p-3 text-left cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-muted-foreground">✅ AI 已为你选好池子，点击打开</p>
          <p className="text-sm font-semibold mt-0.5">{vault.name}</p>
          <p className="text-xs text-muted-foreground">{vault.protocol} · {vault.network}</p>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-lg font-bold text-green-600">{vault.apy.total.toFixed(2)}%</p>
          <p className="text-xs text-muted-foreground">APY</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium">
        立即 Stake →
      </div>
    </button>
  )
}
