'use client'

import { useCallback } from 'react'
import type { UIMessage } from 'ai'
import { loadChatHistory, saveChatHistory, clearChatHistory } from '@/store/chat'

export function useChatHistory() {
  const loadMessages = useCallback((): UIMessage[] => {
    return loadChatHistory()
  }, [])

  const saveMessages = useCallback((messages: UIMessage[]) => {
    saveChatHistory(messages)
  }, [])

  const clearHistory = useCallback(() => {
    clearChatHistory()
  }, [])

  return { loadMessages, saveMessages, clearHistory }
}
