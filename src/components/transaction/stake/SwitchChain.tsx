'use client'

import { Spinner } from '@/components/ui/spinner'

export function SwitchChain({ targetNetwork }: { targetNetwork: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <Spinner />
      <p className="text-sm text-muted-foreground">
        正在切换到 <span className="font-medium text-foreground">{targetNetwork}</span> 网络…
      </p>
    </div>
  )
}
