import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { VaultDetail } from '@/components/vault/VaultDetail'

interface PageProps {
  params: Promise<{ chainId: string; address: string }>
}

export default function VaultDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<VaultDetailSkeleton />}>
      <VaultDetailLoader params={params} />
    </Suspense>
  )
}

async function VaultDetailLoader({ params }: PageProps) {
  const { chainId, address } = await params
  const baseUrl = process.env.NEXT_PUBLIC_EARN_BASE_URL ?? 'https://earn.li.fi'
  const res = await fetch(`${baseUrl}/v1/earn/vaults/${chainId}/${address}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const vault = await res.json()
  return <VaultDetail vault={vault} />
}

function VaultDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}
