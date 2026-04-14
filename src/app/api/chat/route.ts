import { streamChat } from '@/lib/ai/chat'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamChat(messages)
  return result.toUIMessageStreamResponse()
}
