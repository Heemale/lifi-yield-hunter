'use client'

import { useState } from 'react'
import type { UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { LoadingDots } from '@/components/ui/loading-dots'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { StakeModal } from '@/components/transaction/stake'
import { useAIChat } from '@/hooks/ai/useAIChat'
import { useUIAction } from '@/context/ai/UIActionContext'
import type { VaultSummary } from '@/lib/ai/earn-queries'

interface AIPanelProps {
  className?: string
}

export function AIPanel({ className }: AIPanelProps) {
  const { messages, input, setInput, isLoading, bottomRef, handleSubmit, clearHistory, sendQuick, walletAddress } = useAIChat()
  const { pendingStake, clearPendingActions } = useUIAction()

  const [stakeVault, setStakeVault] = useState<VaultSummary | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // AI triggered stake — open modal
  if (pendingStake && !modalOpen) {
    setStakeVault(pendingStake.vault)
    setModalOpen(true)
    clearPendingActions()
  }

  function handleStake(vault: VaultSummary) {
    setStakeVault(vault)
    setModalOpen(true)
  }

  const quickActions = [
    { label: '🔥 Base 最高 APY', text: '帮我选 Base 链最高 APY 的池子 stake' },
    { label: '💎 ETH 最高 APY', text: '帮我选 ETH 链最高 APY 的池子 stake' },
    {
      label: '📊 查看持仓',
      text: walletAddress ? `查看钱包 ${walletAddress} 的持仓` : '查看我的持仓',
    },
  ]

  return (
    <div className={`flex flex-col h-full ${className ?? ''}`}>
      <div className="px-4 py-3 border-b shrink-0 flex items-center justify-between">
        <p className="text-sm font-medium">Yield Hunter AI</p>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}
            className="text-xs text-muted-foreground hover:text-destructive">
            清除记录
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-xs text-center mt-8">
            试试问：「帮我在Base链选APY最高的池子stake」
          </p>
        )}
        {messages.map((m: UIMessage) => (
          <MessageBubble key={m.id} message={m} onStake={handleStake} />
        ))}
        {isLoading && (
          <div className="bg-muted text-muted-foreground px-3 py-2 rounded-xl text-sm mr-8 flex items-center gap-2">
            <LoadingDots /><span>思考中...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex flex-col gap-2 shrink-0">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map(({ label, text }) => (
              <button key={label} type="button" onClick={() => sendQuick(text)} disabled={isLoading}
                className="px-2.5 py-1 rounded-full text-xs border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="问我关于vault收益的问题..."
            className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            disabled={isLoading} />
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>发送</Button>
        </div>
      </form>

      <StakeModal
        vault={modalOpen ? stakeVault : null}
        mode="stake"
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
