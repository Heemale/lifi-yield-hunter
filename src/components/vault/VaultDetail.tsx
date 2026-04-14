'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChainIcon } from '@/components/chain/ChainIcon'
import { Button } from '@/components/ui/button'
import { formatUsd, formatApy } from '@/utils/format'
import { StakeModal } from '@/components/transaction/stake'
import type { Vault } from '@/types'
import type { VaultSummary } from '@/lib/ai/earn-queries'

interface VaultDetailProps {
  vault: Vault
}

export function VaultDetail({ vault }: VaultDetailProps) {
  const [stakeOpen, setStakeOpen] = useState(false)

  const tvl = formatUsd(vault.analytics.tvl.usd)
  const apy = formatApy(vault.analytics.apy.total)
  const apy1d = formatApy(vault.analytics.apy1d)
  const apy7d = formatApy(vault.analytics.apy7d)
  const apy30d = formatApy(vault.analytics.apy30d)

  // Convert Vault to VaultSummary for StakeModal
  const vaultSummary: VaultSummary = {
    name: vault.name,
    protocol: vault.protocol.name,
    network: vault.network,
    chainId: vault.chainId,
    address: vault.address,
    apy: {
      total: vault.analytics.apy.total,
      base: vault.analytics.apy.base,
      reward: vault.analytics.apy.reward ?? 0,
      rewardRatio: vault.analytics.apy.total > 0
        ? Math.round(((vault.analytics.apy.reward ?? 0) / vault.analytics.apy.total) * 1000) / 10
        : 0,
    },
    apy1d: vault.analytics.apy1d,
    apy7d: vault.analytics.apy7d,
    apy30d: vault.analytics.apy30d,
    tvlUsd: Number(vault.analytics.tvl.usd),
    tags: vault.tags,
    isRedeemable: vault.isRedeemable,
    isTransactional: vault.isTransactional,
    riskTag: 'low',
    underlyingTokens: vault.underlyingTokens,
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      {/* Back */}
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        ← 返回列表
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{vault.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChainIcon chainId={vault.chainId} size={16} label={vault.network} />
            <span>{vault.network}</span>
            <span>·</span>
            <a
              href={vault.protocol.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {vault.protocol.name}
            </a>
          </div>
          {vault.description && (
            <p className="text-sm text-muted-foreground mt-1">{vault.description}</p>
          )}
        </div>
        {vault.isTransactional && (
          <Button onClick={() => setStakeOpen(true)} className="shrink-0">
            Stake
          </Button>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="TVL" value={`${tvl}`} />
        <StatCard label="APY" value={apy} highlight />
        <StatCard label="1d APY" value={apy1d} />
        <StatCard label="7d APY" value={apy7d} />
        <StatCard label="30d APY" value={apy30d} />
        <StatCard label="Base APY" value={formatApy(vault.analytics.apy.base)} />
        <StatCard label="Reward APY" value={formatApy(vault.analytics.apy.reward)} />
      </div>

      {/* Underlying tokens */}
      {vault.underlyingTokens.length > 0 && (
        <Section title="Underlying Tokens">
          <div className="flex flex-wrap gap-2">
            {vault.underlyingTokens.map(t => (
              <span
                key={t.address}
                className="px-3 py-1 rounded-full bg-muted text-sm font-medium"
              >
                {t.symbol}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Tags */}
      {vault.tags.length > 0 && (
        <Section title="Tags">
          <div className="flex flex-wrap gap-2">
            {vault.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Address */}
      <Section title="合约地址">
        <code className="text-xs break-all text-muted-foreground">{vault.address}</code>
      </Section>

      <StakeModal
        vault={stakeOpen ? vaultSummary : null}
        mode="stake"
        onClose={() => setStakeOpen(false)}
      />
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border p-4 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-lg font-semibold ${highlight ? 'text-green-500' : ''}`}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  )
}
