'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface ChatContextValue {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  /** Connected wallet address (lowercase), or undefined if not connected */
  walletAddress: string | undefined
  setWalletAddress: (address: string | undefined) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Always start closed to avoid SSR/client mismatch; open on PC after mount
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 1024) setIsOpen(true)
  }, [])
  const [walletAddress, setWalletAddressState] = useState<string | undefined>(undefined)

  const setWalletAddress = (address: string | undefined) => {
    setWalletAddressState(address?.toLowerCase())
  }

  const { address } = useAccount()
  useEffect(() => {
    setWalletAddress(address)
  }, [address])

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat: () => setIsOpen(true),
        closeChat: () => setIsOpen(false),
        toggleChat: () => setIsOpen(prev => !prev),
        walletAddress,
        setWalletAddress,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
