'use client'

import { useWallet } from '@/hooks/wallet/useWallet'
import { usePortfolio } from '@/hooks/vault/usePortfolio'
import { PositionList } from '@/components/portfolio/PositionList'
import { Button } from '@/components/ui/button'
import type { Position } from '@/types'

const MOCK_POSITIONS: Position[] = [
  {
    chainId: 8453,
    protocolName: 'morpho-v1',
    asset: { address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    balanceUsd: '102.45',
    balanceNative: '102.450000',
  },
  {
    chainId: 1,
    protocolName: 'pendle',
    asset: { address: '0x385c279445581a186a4182a5503094ebb652ec71', name: 'PT-sUSDu-23APR2026', symbol: 'PT-sUSDu', decimals: 18 },
    balanceUsd: '5.77',
    balanceNative: '1.008963',
  },
  {
    chainId: 42161,
    protocolName: 'aave-v3',
    asset: { address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    balanceUsd: '250.00',
    balanceNative: '250.000000',
  },
]

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_PORTFOLIO === 'true'

export default function PortfolioPage() {
  const { address, isConnected, connect } = useWallet()
  const { positions: livePositions, isLoading, error, refetch } = usePortfolio(address)

  const positions = USE_MOCK ? MOCK_POSITIONS : livePositions

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">连接钱包以查看持仓</p>
        <Button onClick={connect}>连接钱包</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">我的持仓</h1>
        <div className="flex items-center gap-3">
          {USE_MOCK && (
            <span className="text-xs text-amber-500 border border-amber-500/30 rounded px-2 py-0.5">测试数据</span>
          )}
          <button onClick={refetch} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            刷新
          </button>
        </div>
      </div>

      <PositionList
        positions={positions}
        isLoading={USE_MOCK ? false : isLoading}
        error={USE_MOCK ? null : error}
        onRetry={refetch}
      />
    </div>
  )
}
