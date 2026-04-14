import type { UIMessage } from 'ai'
import { storageGet, storageSet, storageRemove } from './storage'

const KEY = 'yield-hunter:chat'
const MAX_MESSAGES = 100

interface ChatHistoryStore {
  version: 1
  messages: UIMessage[]
  updatedAt: string
}

export function loadChatHistory(): UIMessage[] {
  const store = storageGet<ChatHistoryStore | null>(KEY, null)
  return store?.messages ?? []
}

export function saveChatHistory(messages: UIMessage[]): void {
  const capped = messages.length > MAX_MESSAGES
    ? messages.slice(messages.length - MAX_MESSAGES)
    : messages
  const store: ChatHistoryStore = {
    version: 1,
    messages: capped,
    updatedAt: new Date().toISOString(),
  }
  storageSet(KEY, store)
}

export function clearChatHistory(): void {
  storageRemove(KEY)
}
