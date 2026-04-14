import { getPortfolio } from '@/services/lifi/earn'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  const data = await getPortfolio(address)
  return Response.json(data)
}
