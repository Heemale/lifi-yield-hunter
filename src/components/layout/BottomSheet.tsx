'use client'

import { useRef, useEffect, useCallback } from 'react'

interface BottomSheetProps {
  children: React.ReactNode
  onClose: () => void
}

const SHEET_HEIGHT = 0.8 // 80vh
const CLOSE_THRESHOLD = 0.25 // 下滑超过面板高度 25% 时关闭

export function BottomSheet({ children, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startY: number; startTranslate: number } | null>(null)
  const currentTranslate = useRef(0)

  const setTranslate = useCallback((y: number) => {
    currentTranslate.current = y
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${y}px)`
    }
  }, [])

  const onPointerDown = useCallback((e: PointerEvent) => {
    dragState.current = { startY: e.clientY, startTranslate: currentTranslate.current }
    handleRef.current?.setPointerCapture(e.pointerId)
    if (sheetRef.current) sheetRef.current.style.transition = 'none'
  }, [])

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragState.current) return
    const delta = e.clientY - dragState.current.startY
    const next = Math.max(0, dragState.current.startTranslate + delta)
    setTranslate(next)
  }, [setTranslate])

  const onPointerUp = useCallback(() => {
    if (!dragState.current) return
    dragState.current = null
    if (sheetRef.current) sheetRef.current.style.transition = ''

    const sheetH = window.innerHeight * SHEET_HEIGHT
    if (currentTranslate.current > sheetH * CLOSE_THRESHOLD) {
      // animate out then close
      setTranslate(sheetH)
      setTimeout(onClose, 200)
    } else {
      setTranslate(0)
    }
  }, [setTranslate, onClose])

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return
    handle.addEventListener('pointerdown', onPointerDown)
    handle.addEventListener('pointermove', onPointerMove)
    handle.addEventListener('pointerup', onPointerUp)
    handle.addEventListener('pointercancel', onPointerUp)
    return () => {
      handle.removeEventListener('pointerdown', onPointerDown)
      handle.removeEventListener('pointermove', onPointerMove)
      handle.removeEventListener('pointerup', onPointerUp)
      handle.removeEventListener('pointercancel', onPointerUp)
    }
  }, [onPointerDown, onPointerMove, onPointerUp])

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] rounded-t-2xl bg-background border-t border-border flex flex-col overflow-hidden transition-transform duration-200"
    >
      {/* Drag handle */}
      <div
        ref={handleRef}
        className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="拖动关闭"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
