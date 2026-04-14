import type { VaultSummary } from '@/lib/ai/earn-queries'
import type { SortConfig, SortKey } from '@/lib/vault/filters'
import { VaultRow } from '@/components/vault/VaultRow'
import { InfoTooltip } from '@/components/ui/info-tooltip'

const SCORE_TOOLTIP = `综合评分（0–100），越高越值得关注：

💰 TVL 占 40 分
资金池越大越安全，流动性更好

📈 APY 占 40 分
年化收益越高得分越高（上限 200%）

🛡️ 风险占 20 分
低风险 +20，中风险 +10，高风险 +0`

interface VaultTableProps {
  vaults: (VaultSummary & { score: number })[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  sortConfig: SortConfig
  onSortChange: (key: SortKey) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onStake?: (vault: VaultSummary) => void
  onUnstake?: (vault: VaultSummary) => void
}

function SortArrow({ dir }: { dir: 'asc' | 'desc' }) {
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function VaultTable({
  vaults, isLoading, error, onRetry,
  sortConfig, onSortChange,
  favorites, onToggleFavorite,
  onStake, onUnstake,
}: VaultTableProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
        <p>{error.message || '加载失败，请重试'}</p>
        <button onClick={onRetry} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
            <th className="px-4 py-3 font-medium">☆</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Chain</th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => onSortChange('tvlUsd')}>
              TVL {sortConfig.key === 'tvlUsd' && <SortArrow dir={sortConfig.dir} />}
            </th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => onSortChange('apy')}>
              APY {sortConfig.key === 'apy' && <SortArrow dir={sortConfig.dir} />}
            </th>
            <th className="px-4 py-3 font-medium">1d APY</th>
            <th className="px-4 py-3 font-medium">7d APY</th>
            <th className="px-4 py-3 font-medium">30d APY</th>
            <th className="px-4 py-3 font-medium">
              <span className="flex items-center gap-1">
                Score
                <InfoTooltip content={SCORE_TOOLTIP} />
              </span>
            </th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {Array.from({ length: 11 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-4 rounded bg-muted animate-pulse" /></td>
                ))}
              </tr>
            ))
          ) : vaults.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-12 text-center text-sm text-muted-foreground">暂无符合条件的 Vault</td>
            </tr>
          ) : (
            vaults.map(vault => {
              const id = `${vault.chainId}:${vault.address}`
              return (
                <VaultRow
                  key={id}
                  vault={vault}
                  isFavorite={favorites.has(id)}
                  onToggleFavorite={() => onToggleFavorite(id)}
                  onStake={onStake}
                  onUnstake={onUnstake}
                />
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
