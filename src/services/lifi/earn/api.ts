import { earnApi } from '@/lib/axios'
import type { VaultFilters, VaultsResponse, PortfolioResponse } from './types'

export async function getVaults(filters?: VaultFilters): Promise<VaultsResponse> {
  try {
    const { data } = await earnApi.get('/v1/earn/vaults', {
      params: {
        ...(filters?.chainId && { chainId: filters.chainId }),
        ...(filters?.minApy && { minApy: filters.minApy }),
        ...(filters?.asset && { asset: filters.asset }),
        sortBy: 'apy',
      },
    })
    return data
  } catch (e) {
    console.error('getVaults failed:', e)
    return { data: [], total: 0 }
  }
}

export async function getVaultDetail(network: string, address: string) {
  try {
    const { data } = await earnApi.get(`/v1/earn/vaults/${network}/${address}`)
    return data
  } catch (e) {
    console.error('getVaultDetail failed:', e)
    return null
  }
}

export async function getPortfolio(address: string): Promise<PortfolioResponse> {
  try {
    const { data } = await earnApi.get(`/v1/earn/portfolio/${address}/positions`)
    return data
  } catch (e) {
    console.error('getPortfolio failed:', e)
    return { positions: [] }
  }
}
