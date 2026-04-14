'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatHistory } from '@/hooks/ai/useChatHistory'
import { useUIAction } from '@/context/ai/UIActionContext'
import { useChatContext } from '@/context/ai/ChatContext'
import { useWallet } from '@/hooks/wallet/useWallet'
import { parseActions, ACTION_KEYS } from '@/lib/ai/actions'
import { saveChainFilter, clearChainFilter } from '@/store/vaultFilters'
import type { VaultSummary } from '@/lib/ai/earn-queries'

export function useAIChat() {
  const { loadMessages, saveMessages, clearHistory: clearStoredHistory } = useChatHistory()
  const { setPendingStake } = useUIAction()
  const { openChat } = useChatContext()
  const { address } = useWallet()

  // Load history only on client to avoid SSR/hydration mismatch
  const initialMessages = useRef(loadMessages())

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: initialMessages.current,
  })

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const isLoading = status === 'submitted' || status === 'streaming'
  const processedMsgIds = useRef<Set<string>>(new Set())
  // Only execute actions after user sends at least one message in this session
  const userSentMessageRef = useRef(false)
  // Track last processed message count to only scan newly added messages
  const lastProcessedCountRef = useRef(0)

  // Persist on change
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages)
  }, [messages, saveMessages])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Parse and execute AI action commands — only after streaming completes
  useEffect(() => {
    if (status === 'streaming') return
    if (!userSentMessageRef.current) return

    // Only scan messages added since last processing
    const newMessages = messages.slice(lastProcessedCountRef.current)
    lastProcessedCountRef.current = messages.length

    // Collect all actions from new messages, last one wins for stake-modal
    let latestStakeVault: VaultSummary | null = null

    for (const m of newMessages) {
      if (m.role !== 'assistant') continue
      if (processedMsgIds.current.has(m.id)) continue
      processedMsgIds.current.add(m.id)

      for (const part of m.parts) {
        if (part.type !== 'text') continue
        const actions = parseActions(part.text)
        for (const { key, value } of actions) {
          if (key === ACTION_KEYS.CHAIN_FILTER) {
            const chainId = Number(value)
            if (chainId) saveChainFilter(chainId)
            else clearChainFilter()
          }
          if (key === ACTION_KEYS.STAKE_MODAL) {
            try {
              latestStakeVault = JSON.parse(value) as VaultSummary
            } catch {
              console.warn('[useAIChat] failed to parse stake-modal action value:', value)
            }
          }
        }
      }
    }

    // Only open modal once with the last vault found
    if (latestStakeVault) {
      openChat()
      setPendingStake({ vault: latestStakeVault, mode: 'stake' })
    }
  }, [messages, status, setPendingStake])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    // Mark all current messages as processed before sending — prevents history from executing
    for (const m of messages) processedMsgIds.current.add(m.id)
    lastProcessedCountRef.current = messages.length
    userSentMessageRef.current = true
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] })
    setInput('')
  }

  const clearHistory = () => {
    clearStoredHistory()
    setMessages([])
    processedMsgIds.current.clear()
    lastProcessedCountRef.current = 0
    userSentMessageRef.current = false
  }

  const sendQuick = (text: string) => {
    if (isLoading) return
    for (const m of messages) processedMsgIds.current.add(m.id)
    lastProcessedCountRef.current = messages.length
    userSentMessageRef.current = true
    sendMessage({ role: 'user', parts: [{ type: 'text', text }] })
  }

  return { messages, input, setInput, isLoading, bottomRef, handleSubmit, clearHistory, sendQuick, walletAddress: address }
}
