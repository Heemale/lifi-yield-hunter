/** Tag 中文标签映射 */
export const TAG_LABELS: Record<string, string> = {
  stablecoin: '稳定币',
  single:     '单币',
  lp:         'LP',
  audited:    '已审计',
  boosted:    '加速',
}

/** 格式化 TVL 为可读字符串，如 1.23M / 456.7K */
export function formatTvl(tvlUsd: number): string {
  if (tvlUsd >= 1_000_000) return `${(tvlUsd / 1_000_000).toFixed(2)}M`
  if (tvlUsd >= 1_000)     return `${(tvlUsd / 1_000).toFixed(1)}K`
  return `${tvlUsd.toFixed(0)}`
}
