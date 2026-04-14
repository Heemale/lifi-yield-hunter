'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { getExplorerUrl } from './helpers'

function TxHashLink({ txHash, explorerUrl }: { txHash: string; explorerUrl: string }) {
  const short = `${txHash.slice(0, 8)}…${txHash.slice(-6)}`
  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-primary underline underline-offset-2 hover:opacity-80 break-all"
    >
      {short} ↗
    </a>
  )
}

export function PendingState({ txHash, chainId }: { txHash: string; chainId: number }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <Spinner />
      <p className="text-sm font-medium">交易广播中，等待链上确认…</p>
      <TxHashLink txHash={txHash} explorerUrl={getExplorerUrl(chainId, txHash)} />
    </div>
  )
}

export function SuccessState({ txHash, chainId, onClose }: { txHash: string; chainId: number; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">✓</div>
      <p className="text-sm font-medium">交易成功！</p>
      <TxHashLink txHash={txHash} explorerUrl={getExplorerUrl(chainId, txHash)} />
      <Button onClick={onClose} className="w-full mt-2">关闭</Button>
    </div>
  )
}

export function ErrorState({ error, onRetry, onClose }: { error: string | null; onRetry: () => void; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">✕</div>
      <p className="text-sm font-medium text-destructive">{error ?? '发生未知错误，请重试'}</p>
      <div className="flex gap-2 w-full">
        <Button variant="outline" onClick={onClose} className="flex-1">关闭</Button>
        <Button onClick={onRetry} className="flex-1">重试</Button>
      </div>
    </div>
  )
}
