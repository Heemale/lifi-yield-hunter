'use client'

import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { createWagmiConfig } from '@/lib/wagmi/config'
import { initLiFiSDK } from '@/lib/lifi/config'
import '@rainbow-me/rainbowkit/styles.css'

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [config] = useState(() => {
    const wagmiConfig = createWagmiConfig()
    initLiFiSDK(wagmiConfig)
    return wagmiConfig
  })
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
