import type { VaultSummary } from '@/lib/ai/earn-queries'
import type { TokenWithBalance } from '@/hooks/wallet/useTokenBalances'
import type { StakeQuote } from '@/hooks/transaction/useStakeTransaction'

export interface StakeModalProps {
  vault: VaultSummary | null
  mode: 'stake' | 'unstake'
  onClose: () => void
}

export interface AmountInputProps {
  mode: 'stake' | 'unstake'
  amount: string
  selectedToken: TokenWithBalance | null
  availableTokens: TokenWithBalance[]
  isLoadingTokens: boolean
  vault: VaultSummary
  slippage: number
  onChange: (v: string) => void
  onSelectToken: (t: TokenWithBalance) => void
  onSlippageChange: (v: number) => void
  onSubmit: () => void
}

export interface QuoteDetailsProps {
  quote: StakeQuote
  decimals: number
  symbol: string
  totalFeeUsd: number | null
  totalGasUsd: number | null
  onConfirm: () => void
  onBack: () => void
}
