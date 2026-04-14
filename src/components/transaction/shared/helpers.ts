export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/tx',
    137: 'https://polygonscan.com/tx',
    42161: 'https://arbiscan.io/tx',
    10: 'https://optimistic.etherscan.io/tx',
    8453: 'https://basescan.org/tx',
  }
  const base = explorers[chainId] ?? 'https://blockscan.com/tx'
  return `${base}/${txHash}`
}

export function formatTokenAmount(raw: string, decimals: number): string {
  try {
    const value = Number(BigInt(raw)) / Math.pow(10, decimals)
    return value.toFixed(6)
  } catch {
    return raw
  }
}

export function formatUsd(amount: string | number): string {
  const n = typeof amount === 'number' ? amount : parseFloat(amount)
  if (isNaN(n)) return String(amount)
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
}
