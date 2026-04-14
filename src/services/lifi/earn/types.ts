import type { Vault, Position, VaultFilters } from '@/types'

export type { Vault, Position, VaultFilters }

export interface VaultsResponse {
  data: Vault[]
  total: number
}

export interface PortfolioResponse {
  positions: Position[]
}
