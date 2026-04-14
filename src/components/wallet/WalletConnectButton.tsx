'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'

interface WalletConnectButtonProps {
  className?: string
}

export function WalletConnectButton({ className }: WalletConnectButtonProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className={className}>
      {mounted ? <ConnectButton /> : <div className="h-10 w-36 rounded-xl bg-muted animate-pulse" />}
    </div>
  )
}
