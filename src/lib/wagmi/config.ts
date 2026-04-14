import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  mainnet, arbitrum, base, bsc, optimism, polygon, avalanche, gnosis, metis,
  lisk, fuse, moonbeam, unichain, sei, immutableZkEvm, flare, sonic, vana,
  gravity, taiko, soneium, swellchain, ronin, opBNB, corn, lens, cronos,
  fraxtal, abstract, morph, boba, rootstock, zkSync, apeChain, mode, telos,
  celo, etherlink, hemi, worldchain, xdc, mantle, sophon, scroll,
  superposition, ink, linea, bob, flowMainnet, berachain, blast, kaia,
  plumeMainnet, stable,
} from 'wagmi/chains'
import { http } from 'wagmi'

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'placeholder-project-id'

export const SUPPORTED_CHAINS = [
  mainnet, arbitrum, base, bsc, optimism, polygon, avalanche, gnosis, metis,
  lisk, fuse, moonbeam, unichain, sei, immutableZkEvm, flare, sonic, vana,
  gravity, taiko, soneium, swellchain, ronin, opBNB, corn, lens, cronos,
  fraxtal, abstract, morph, boba, rootstock, zkSync, apeChain, mode, telos,
  celo, etherlink, hemi, worldchain, xdc, mantle, sophon, scroll,
  superposition, ink, linea, bob, flowMainnet, berachain, blast, kaia,
  plumeMainnet, stable,
] as const

// Call only on client side to avoid SSR indexedDB errors
export function createWagmiConfig() {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    console.warn(
      '[WalletProvider] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect may not work correctly.'
    )
  }
  return getDefaultConfig({
    appName: 'Yield Hunter',
    projectId,
    chains: SUPPORTED_CHAINS,
    transports: Object.fromEntries(SUPPORTED_CHAINS.map(c => [c.id, http()])),
    ssr: false,
  })
}
