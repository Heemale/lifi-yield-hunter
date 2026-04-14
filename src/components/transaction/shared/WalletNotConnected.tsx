'use client'

import { Button } from '@/components/ui/button'

export function WalletNotConnected({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">请先连接钱包以继续操作</p>
      <Button onClick={onConnect} size="lg">连接钱包</Button>
    </div>
  )
}
