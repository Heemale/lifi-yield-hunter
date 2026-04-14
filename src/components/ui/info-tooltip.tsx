'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface InfoTooltipProps {
  content: string
  className?: string
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  function updatePos() {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.top - 8, left: r.left + r.width / 2 })
  }

  useEffect(() => {
    if (!open) return
    updatePos()
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex size-4 items-center justify-center rounded-full border text-[10px] font-semibold leading-none transition-colors',
          open
            ? 'border-foreground bg-foreground text-background'
            : 'border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground'
        )}
        aria-label="更多信息"
      >
        i
      </button>

      {open && (
        <div
          className="fixed z-[9999] w-64 -translate-x-1/2 -translate-y-full rounded-lg border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="whitespace-pre-line leading-relaxed">{content}</div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border" />
          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-[-1px] border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  )
}
