import type { VaultSummary } from '@/lib/ai/earn-queries'

/**
 * 计算单个 Vault 的综合评分（0–100 整数）
 *
 * 公式：
 *   score_tvl  = min(log10(tvlUsd + 1) / log10(maxTvlUsd + 1), 1) × 40
 *   score_apy  = min(apy.total / 200, 1) × 40   (负值 clamp 到 0)
 *   score_risk = riskTag === 'low' ? 20 : riskTag === 'medium' ? 10 : 0
 *   score      = round(score_tvl + score_apy + score_risk)
 */
export function calcScore(vault: VaultSummary, maxTvlUsd: number): number {
  // TVL 分项：对数归一化，权重 40%
  const scoreTvl =
    maxTvlUsd <= 0
      ? 0
      : Math.min(Math.log10(vault.tvlUsd + 1) / Math.log10(maxTvlUsd + 1), 1) * 40

  // APY 分项：线性归一化，上限 200%，负值 clamp 到 0，权重 40%
  const scoreApy = Math.max(0, Math.min(vault.apy.total / 200, 1)) * 40

  // 风险标签分项：权重 20%
  const scoreRisk =
    vault.riskTag === 'low' ? 20 : vault.riskTag === 'medium' ? 10 : 0

  return Math.round(scoreTvl + scoreApy + scoreRisk)
}

/**
 * 批量计算 Score，自动从完整列表推导 maxTvlUsd
 */
export function calcScores(vaults: VaultSummary[]): (VaultSummary & { score: number })[] {
  const maxTvlUsd = vaults.length > 0 ? Math.max(...vaults.map(v => v.tvlUsd)) : 0
  return vaults.map(v => ({ ...v, score: calcScore(v, maxTvlUsd) }))
}
