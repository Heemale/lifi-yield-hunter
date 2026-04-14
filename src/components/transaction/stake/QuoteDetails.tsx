'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { formatTokenAmount } from '../shared/helpers'
import type { QuoteDetailsProps } from './types'

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', highlight && 'text-green-600')}>{value}</span>
    </div>
  )
}

function fmtUsd(n: number): string {
  return n < 0.01 && n > 0
    ? '<$0.01'
    : n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 })
}

export function QuoteDetails({ quote, decimals, symbol, totalFeeUsd, totalGasUsd, onConfirm, onBack }: QuoteDetailsProps) {
  const toAmount    = formatTokenAmount(quote.estimate.toAmount, decimals)
  const toAmountMin = formatTokenAmount(quote.estimate.toAmountMin, decimals)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border bg-muted/20 p-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground">
            存入后获得
            <InfoTooltip content={`${symbol} 是 vault 份额凭证，持有即自动累积收益，unstake 时可赎回为底层资产。`} />
          </span>
          <span className="font-medium text-green-600">{toAmount} {symbol}</span>
        </div>
        <Row label="最低获得（含滑点）" value={`${toAmountMin} ${symbol}`} />
        <Row label="路由" value={quote.toolDetails?.name ?? quote.tool} />
        {totalFeeUsd !== null && <Row label="协议手续费" value={fmtUsd(totalFeeUsd)} />}
        {totalGasUsd !== null && <Row label="预估 Gas"   value={fmtUsd(totalGasUsd)} />}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">返回</Button>
        <Button onClick={onConfirm} className="flex-1">确认并签名</Button>
      </div>
    </div>
  )
}
