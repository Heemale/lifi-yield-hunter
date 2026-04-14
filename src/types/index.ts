export interface VaultProtocol {
  name: string
  url: string
}

export interface VaultToken {
  address: string
  symbol: string
  decimals: number
}

export interface VaultApy {
  base: number
  reward: number | null
  total: number
}

export interface VaultAnalytics {
  apy: VaultApy
  apy1d: number | null
  apy7d: number | null
  apy30d: number | null
  tvl: { usd: string }
  updatedAt: string
}

export interface Vault {
  address: string
  network: string
  chainId: number
  slug: string
  name: string
  description?: string
  protocol: VaultProtocol
  underlyingTokens: VaultToken[]
  tags: string[]
  analytics: VaultAnalytics
  isTransactional: boolean
  isRedeemable: boolean
}

export interface Position {
  chainId: number
  protocolName: string
  asset: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  balanceUsd: string
  balanceNative: string
}

export interface VaultFilters {
  chainId?: number
  minApy?: number
  tag?: string
  asset?: string  // token symbol or address
}
