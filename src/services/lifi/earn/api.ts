import { earnApi } from '@/lib/axios'
import type { VaultFilters, VaultsResponse, PortfolioResponse } from './types'
import { config } from "@/config";

export async function getVaults(filters?: VaultFilters): Promise<VaultsResponse> {
  try {
    const { data } = await earnApi.get('/v1/vaults', {
      params: {
        ...(filters?.chainId && { chainId: filters.chainId }),
        ...(filters?.minApy && { minApy: filters.minApy }),
        ...(filters?.asset && { asset: filters.asset }),
        sortBy: 'apy',
      },
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': config.lifi.composer.apiKey,
      }
    })
    return data
  } catch (e) {
    console.error('getVaults failed:', e)
    return { data: [], total: 0 }
  }
}

export async function getVaultDetail(network: string, address: string) {
  try {
    const { data } = await earnApi.get(`/v1/vaults/${network}/${address}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': config.lifi.composer.apiKey,
      }
    })
    return data
  } catch (e) {
    console.error('getVaultDetail failed:', e)
    return null
  }
}

export async function getPortfolio(address: string): Promise<PortfolioResponse> {
  try {
    const { data } = await earnApi.get(`/v1/portfolio/${address}/positions`, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': config.lifi.composer.apiKey,
      }
    })
    return data
  } catch (e) {
    console.error('getPortfolio failed:', e)
    return { positions: [] }
  }
}
