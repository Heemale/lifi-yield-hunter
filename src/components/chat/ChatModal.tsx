'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { Markdown } from '@/components/ui/markdown'
import { Button } from '@/components/ui/button'

/**
 * AI chat panel — renders as a plain flex column.
 * AppLayout is responsible for positioning (right panel on PC, bottom sheet on mobile).
 */
export function ChatModal({ className }: { className?: string }) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] })
    setInput('')
  }

  return (
    <div className={`flex flex-col h-full ${className ?? ''}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0">
        <p className="text-sm font-medium">Yield Hunter AI</p>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-xs text-center mt-8">
            试试问：「Base链上APY最高的vault有哪些？」
          </p>
        )}
        {messages.map((m: UIMessage) => (
          <div
            key={m.id}
            className={`text-sm rounded-xl px-3 py-2 whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground ml-8'
                : 'bg-muted text-foreground mr-8'
            }`}
          >
            {m.parts.map((part, i) => {
              if (part.type === 'text') return <Markdown key={i}>{part.text}</Markdown>
              if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
                const name =
                  part.type === 'dynamic-tool'
                    ? (part as { toolName?: string }).toolName ?? 'tool'
                    : part.type.replace('tool-', '')
                return (
                  <span key={i} className="text-xs opacity-50 italic block">
                    [查询: {name}]
                  </span>
                )
              }
              return null
            })}
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted text-muted-foreground px-3 py-2 rounded-xl text-sm mr-8">
            思考中...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="问我关于vault收益的问题..."
          className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
          发送
        </Button>
      </form>
    </div>
  )
}
