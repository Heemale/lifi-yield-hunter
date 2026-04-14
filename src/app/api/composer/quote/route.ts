import { config } from '@/config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const params = new URLSearchParams()
  for (const key of ['fromChain', 'toChain', 'fromToken', 'toToken', 'fromAmount', 'fromAddress', 'toAddress']) {
    const val = searchParams.get(key)
    if (val) params.set(key, val)
  }
  // Default slippage 0.5%, allow override
  params.set('slippage', searchParams.get('slippage') ?? '0.5')

  const url = `${config.lifi.composer.baseUrl}/v1/quote?${params.toString()}`

  const res = await fetch(url, {
    headers: {
      'x-lifi-api-key': config.lifi.composer.apiKey,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return Response.json(data, { status: res.status })
}
