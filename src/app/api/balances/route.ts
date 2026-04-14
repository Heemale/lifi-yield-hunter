import { config } from '@/config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  const chainId = searchParams.get('chainId')

  if (!address || !chainId) {
    return Response.json({ error: 'address and chainId are required' }, { status: 400 })
  }

  const alchemyNetwork = CHAIN_TO_ALCHEMY[Number(chainId)]
  if (!alchemyNetwork) {
    return Response.json({ error: `Unsupported chainId: ${chainId}` }, { status: 400 })
  }

  const url = `https://${alchemyNetwork}.g.alchemy.com/v2/${config.alchemy.apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address, 'erc20'],
      id: 1,
    }),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}

const CHAIN_TO_ALCHEMY: Record<number, string> = {
  1:     'eth-mainnet',
  56:    'bnb-mainnet',
  137:   'polygon-mainnet',
  42161: 'arb-mainnet',
  10:    'opt-mainnet',
  8453:  'base-mainnet',
  43114: 'avax-mainnet',
  59144: 'linea-mainnet',
  534352:'scroll-mainnet',
  81457: 'blast-mainnet',
  324:   'zksync-mainnet',
}
