'use client'

import { createConfig, EVM } from '@lifi/sdk'
import { getWalletClient, switchChain } from 'wagmi/actions'
import type { Config } from 'wagmi'

let initialized = false

export function initLiFiSDK(wagmiConfig: Config) {
  if (initialized) return
  initialized = true

  createConfig({
    integrator: 'yield-hunter',
    providers: [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId) => {
          await switchChain(wagmiConfig, { chainId })
          return getWalletClient(wagmiConfig, { chainId })
        },
      }),
    ],
  })
}
