'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useStakeTransaction } from '@/hooks/transaction/useStakeTransaction'
import { useTokenBalances } from '@/hooks/wallet/useTokenBalances'
import { useWallet } from '@/hooks/wallet/useWallet'
import { useSwitchChain } from 'wagmi'
import { WalletNotConnected } from '../shared/WalletNotConnected'
import { PendingState, SuccessState, ErrorState } from '../shared/TxStates'
import { SwitchChain } from './SwitchChain'
import { AmountInput } from './AmountInput'
import { QuoteDetails } from './QuoteDetails'
import type { StakeModalProps } from './types'
import type { TokenWithBalance } from '@/hooks/wallet/useTokenBalances'

export function StakeModal({ vault, mode, onClose }: StakeModalProps) {
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance | null>(null)
  const [slippage, setSlippage] = useState(1)

  const { quote, txHash, status, error, fetchQuote, executeTransaction, reset } = useStakeTransaction()
  const { address: wagmiAddress, isConnected, connect, chainId: currentChainId } = useWallet()
  const walletAddress = wagmiAddress ?? null
  const needsChainSwitch = isConnected && vault !== null && currentChainId !== vault.chainId
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (needsChainSwitch && vault) switchChain({ chainId: vault.chainId })
  }, [needsChainSwitch, vault, switchChain])

  const { tokens: availableTokens, isLoading: isLoadingTokens } = useTokenBalances(
    needsChainSwitch ? undefined : vault?.chainId,
    walletAddress ?? undefined
  )

  useEffect(() => {
    if (!availableTokens.length || selectedToken) return
    const underlying = vault?.underlyingTokens[0]
    const preferred = underlying
      ? availableTokens.find(t => t.address.toLowerCase() === underlying.address.toLowerCase())
      : null
    setSelectedToken(preferred ?? availableTokens[0])
  }, [availableTokens, vault, selectedToken])

  useEffect(() => {
    setAmount('')
    setSelectedToken(null)
    reset()
  }, [vault, mode, reset])

  async function handleFetchQuote() {
    if (!vault || !walletAddress || !selectedToken) return
    let amountBigInt: bigint
    try {
      amountBigInt = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, selectedToken.decimals)))
    } catch { return }

    await fetchQuote({
      fromChain: vault.chainId,
      toChain: vault.chainId,
      fromToken: mode === 'stake' ? selectedToken.address : vault.address,
      toToken:   mode === 'stake' ? vault.address : selectedToken.address,
      fromAddress: walletAddress,
      toAddress:   walletAddress,
      fromAmount: amountBigInt.toString(),
      action: mode,
      slippage: slippage / 100,
    })
  }

  function handleClose() { reset(); setAmount(''); onClose() }

  const toTokenDecimals = (quote?.action.toToken as { decimals?: number } | null)?.decimals ?? 18
  const toTokenSymbol   = (quote?.action.toToken as { symbol?: string }  | null)?.symbol   ?? vault?.underlyingTokens[0]?.symbol ?? ''
  const totalFeeUsd = quote ? quote.estimate.feeCosts.reduce((s, f) => s + parseFloat(f.amountUSD || '0'), 0) : null
  const totalGasUsd = quote ? quote.estimate.gasCosts.reduce((s, g) => s + parseFloat(g.amountUSD || '0'), 0) : null

  if (!vault) return null

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{mode === 'stake' ? 'Stake' : 'Unstake'} {vault.name}</DialogTitle>
        </DialogHeader>
        <div className="py-2 overflow-y-auto flex-1 pr-1">
          {!isConnected ? (
            <WalletNotConnected onConnect={connect} />
          ) : needsChainSwitch ? (
            <SwitchChain targetNetwork={vault.network} />
          ) : (
            <>
              {status === 'idle' && (
                <AmountInput
                  mode={mode} amount={amount} selectedToken={selectedToken}
                  availableTokens={availableTokens} isLoadingTokens={isLoadingTokens}
                  vault={vault} slippage={slippage}
                  onChange={setAmount} onSelectToken={setSelectedToken}
                  onSlippageChange={setSlippage} onSubmit={handleFetchQuote}
                />
              )}
              {status === 'fetching-quote' && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Spinner />
                  <p className="text-sm text-muted-foreground">正在获取最优报价…</p>
                </div>
              )}
              {status === 'show-quote' && quote && (
                <QuoteDetails
                  quote={quote} decimals={toTokenDecimals} symbol={toTokenSymbol}
                  totalFeeUsd={totalFeeUsd} totalGasUsd={totalGasUsd}
                  onConfirm={executeTransaction} onBack={reset}
                />
              )}
              {status === 'waiting-signature' && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Spinner />
                  <p className="text-sm font-medium">等待钱包签名…</p>
                  <p className="text-xs text-muted-foreground">请在钱包中确认交易</p>
                </div>
              )}
              {status === 'pending'  && txHash && <PendingState txHash={txHash} chainId={vault.chainId} />}
              {status === 'success'  && txHash && <SuccessState txHash={txHash} chainId={vault.chainId} onClose={handleClose} />}
              {status === 'error'    && <ErrorState error={error} onRetry={reset} onClose={handleClose} />}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
