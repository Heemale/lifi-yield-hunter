/**
 * Calculates a risk tag for a vault based on TVL and audit status.
 *
 * Rules:
 * - TVL >= $10M AND tags includes "audited" → "low"
 * - TVL >= $1M (and not low risk) → "medium"
 * - TVL < $1M → "high"
 */
export function calcRiskTag(tvlUsd: number, tags: string[]): 'low' | 'medium' | 'high' {
  if (tvlUsd >= 10_000_000 && tags.includes('audited')) return 'low'
  if (tvlUsd >= 1_000_000) return 'medium'
  return 'high'
}
