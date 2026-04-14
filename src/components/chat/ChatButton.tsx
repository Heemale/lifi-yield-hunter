'use client'

import { useChatContext } from '@/context/ai/ChatContext'
import { Button } from '@/components/ui/button'

export function ChatButton() {
  const { toggleChat } = useChatContext()

  return (
    <Button
      onClick={toggleChat}
      aria-label="打开AI助手"
      size="icon"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-2xl"
    >
      💬
    </Button>
  )
}
