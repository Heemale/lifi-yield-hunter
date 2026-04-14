/**
 * Calculates the APY trend direction by comparing 1-day vs 7-day APY.
 *
 * Returns:
 * - "up"   when apy1d > apy7d
 * - "down" when apy1d < apy7d
 * - "flat" when equal or either value is null
 */
export function calcApyTrend(
  apy1d: number | null,
  apy7d: number | null
): 'up' | 'down' | 'flat' {
  if (apy1d === null || apy7d === null) return 'flat'
  if (apy1d > apy7d) return 'up'
  if (apy1d < apy7d) return 'down'
  return 'flat'
}
