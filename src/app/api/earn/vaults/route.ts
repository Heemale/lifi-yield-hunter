import { getVaults } from '@/services/lifi/earn'
import type { VaultFilters } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const filters: VaultFilters = {
    chainId: searchParams.get('chainId') ? Number(searchParams.get('chainId')) : undefined,
    minApy: searchParams.get('minApy') ? Number(searchParams.get('minApy')) : undefined,
    asset: searchParams.get('asset') ?? undefined,
  }

  const data = await getVaults(filters)
  return Response.json(data)
}
