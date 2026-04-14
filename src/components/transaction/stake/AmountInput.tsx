'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { AmountInputProps } from './types'
import type { TokenWithBalance } from '@/hooks/wallet/useTokenBalances'

const SLIPPAGE_PRESETS = [0.5, 1, 3]

export function AmountInput({
  mode, amount, selectedToken, availableTokens, isLoadingTokens,
  vault, slippage, onChange, onSelectToken, onSlippageChange, onSubmit,
}: AmountInputProps) {
  const [showTokenList, setShowTokenList] = useState(false)
  const [customSlippage, setCustomSlippage] = useState('')
  const isValid = parseFloat(amount) > 0 && selectedToken !== null

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="mb-1 text-xs text-muted-foreground">
          {mode === 'stake' ? 'Stake 金额' : 'Unstake 金额'}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0.000000"
            value={amount}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'min-w-0 w-0 flex-1 bg-transparent text-lg font-medium outline-none',
              'placeholder:text-muted-foreground/50'
            )}
          />
          <button
            type="button"
            onClick={() => setShowTokenList(v => !v)}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-medium hover:bg-muted transition-colors shrink-0"
          >
            {isLoadingTokens ? (
              <span className="text-muted-foreground text-xs">加载中…</span>
            ) : selectedToken ? (
              <>{selectedToken.symbol} <span className="text-muted-foreground">▾</span></>
            ) : (
              <span className="text-muted-foreground text-xs">选择代币 ▾</span>
            )}
          </button>
        </div>
        {selectedToken && (
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                余额：{selectedToken.formattedAmount} {selectedToken.symbol}
              </p>
              <div className="flex gap-1">
                {[25, 50, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onChange((parseFloat(selectedToken.formattedAmount) * pct / 100).toFixed(6))}
                  className="px-1.5 py-0.5 rounded text-xs border border-border hover:bg-muted transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
            {/* Show swap hint when selected token differs from vault's underlying */}
            {mode === 'stake' && vault.underlyingTokens[0] &&
              selectedToken.address.toLowerCase() !== vault.underlyingTokens[0].address.toLowerCase() && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚡ LiFi 将自动将 {selectedToken.symbol} 兑换为 {vault.underlyingTokens[0].symbol} 后存入
              </p>
            )}
          </div>
        )}
      </div>

      {showTokenList && (
        <TokenList
          tokens={availableTokens}
          isLoading={isLoadingTokens}
          selected={selectedToken}
          onSelect={(t) => { onSelectToken(t); setShowTokenList(false) }}
        />
      )}

      <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>协议</span>
          <span className="font-medium text-foreground">{vault.protocol}</span>
        </div>
        <div className="flex justify-between">
          <span>网络</span>
          <span className="font-medium text-foreground">{vault.network}</span>
        </div>
        <div className="flex justify-between">
          <span>当前 APY</span>
          <span className="font-medium text-green-600">{vault.apy.total.toFixed(2)}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>滑点</span>
          <InfoTooltip content="交易实际成交价与报价的最大偏差。滑点越高越容易成交，但可能损失更多。" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SLIPPAGE_PRESETS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { onSlippageChange(p); setCustomSlippage('') }}
              className={cn(
                'px-3 py-1 rounded-md text-xs border transition-colors',
                slippage === p && !customSlippage
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted'
              )}
            >
              {p}%
            </button>
          ))}
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <input
              type="number"
              min="0.1"
              max="50"
              step="0.1"
              placeholder="自定义"
              value={customSlippage}
              onChange={e => {
                setCustomSlippage(e.target.value)
                const v = parseFloat(e.target.value)
                if (!isNaN(v) && v > 0) onSlippageChange(v)
              }}
              className="w-full min-w-0 rounded-md border border-border bg-transparent px-2 py-1 text-xs outline-none focus:border-foreground"
            />
            <span className="text-xs text-muted-foreground shrink-0">%</span>
          </div>
        </div>
      </div>

      <Button onClick={onSubmit} disabled={!isValid} size="lg" className="w-full">
        获取报价
      </Button>
    </div>
  )
}

function TokenList({ tokens, isLoading, selected, onSelect }: {
  tokens: TokenWithBalance[]
  isLoading: boolean
  selected: TokenWithBalance | null
  onSelect: (t: TokenWithBalance) => void
}) {
  return (
    <div className="rounded-lg border bg-popover shadow-md max-h-48 overflow-y-auto">
      {isLoading ? (
        <div className="px-3 py-4 text-center text-xs text-muted-foreground">正在加载代币列表…</div>
      ) : tokens.length === 0 ? (
        <div className="px-3 py-4 text-center text-xs text-muted-foreground">未找到有余额的代币</div>
      ) : (
        tokens.map(t => (
          <button
            key={t.address}
            type="button"
            onClick={() => onSelect(t)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors',
              selected?.address === t.address && 'bg-muted'
            )}
          >
            <span className="font-medium">{t.symbol}</span>
            <span className="text-muted-foreground text-xs">{t.formattedAmount}</span>
          </button>
        ))
      )}
    </div>
  )
}
