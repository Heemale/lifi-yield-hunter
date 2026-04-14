import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  children: string
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown components={{
      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      code: ({ children }) => <code className="bg-black/20 rounded px-1 text-xs">{children}</code>,
    }}>
      {children}
    </ReactMarkdown>
  )
}
