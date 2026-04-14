'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useChatContext } from '@/context/ai/ChatContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton'
import { cn } from '@/lib/utils'
import { BottomSheet } from '@/components/layout/BottomSheet'

interface AppLayoutProps {
  children: React.ReactNode
  aiPanel: React.ReactNode
}

/**
 * Responsive layout:
 * - PC (≥1024px): CSS Grid with left main content + fixed 400px right AI panel
 * - Mobile (<1024px): Single column, AI panel as bottom sheet (80vh)
 */
export function AppLayout({ children, aiPanel }: AppLayoutProps) {
  const { isOpen, toggleChat } = useChatContext()
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: '发现' },
    { href: '/portfolio', label: '持仓' },
  ]

  function NavLinks() {
    return (
      <nav className="flex items-center gap-1 mr-auto">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <>
      {/* PC layout */}
      <div className={cn(
        'hidden lg:grid lg:h-screen lg:overflow-hidden',
        isOpen ? 'lg:grid-cols-[1fr_400px]' : 'lg:grid-cols-[1fr]'
      )}>
        {/* Main content — independent scroll */}
        <main className="overflow-y-auto h-screen">
          {/* PC header */}
          <header className="sticky top-0 z-10 flex items-center justify-end px-6 py-3 min-h-[70px] border-b border-border bg-background/80 backdrop-blur-sm">
            <NavLinks />
            <WalletConnectButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              aria-label={isOpen ? '收起 AI 面板' : '展开 AI 面板'}
              className="ml-2"
            >
              {isOpen ? '⇥' : '⇤'}
            </Button>
          </header>
          {children}
        </main>

        {/* Right AI panel — hidden when collapsed */}
        {isOpen && (
          <aside className="h-screen overflow-hidden border-l border-border flex flex-col">
            {aiPanel}
          </aside>
        )}
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex items-center justify-end px-4 py-2 min-h-[70px] border-b border-border bg-background/80 backdrop-blur-sm">
          <NavLinks />
          <WalletConnectButton />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Floating AI button */}
        {!isOpen && (
          <Button
            onClick={toggleChat}
            aria-label="打开AI助手"
            size="icon"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-2xl"
          >
            💬
          </Button>
        )}

        {/* Bottom sheet overlay */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={toggleChat}
              aria-hidden="true"
            />
            <BottomSheet onClose={toggleChat}>
              {aiPanel}
            </BottomSheet>
          </>
        )}
      </div>
    </>
  )
}
