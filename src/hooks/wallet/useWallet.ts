import { useAccount, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { Chain } from 'viem'

export interface WalletState {
  /** 已连接的钱包地址，未连接时为 undefined */
  address: `0x${string}` | undefined
  /** 是否已连接 */
  isConnected: boolean
  /** 当前链 ID，未连接时为 undefined */
  chainId: number | undefined
  /** 当前链对象（viem Chain），未连接时为 undefined */
  chain: Chain | undefined
  /** 触发 RainbowKit 连接弹窗 */
  connect: () => void
  /** 断开当前钱包连接 */
  disconnect: () => void
}

export function useWallet(): WalletState {
  const { address, isConnected, chain, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  const connect = () => {
    openConnectModal?.()
  }

  return {
    address,
    isConnected,
    chain: chain as Chain | undefined,
    chainId,
    connect,
    disconnect,
  }
}
