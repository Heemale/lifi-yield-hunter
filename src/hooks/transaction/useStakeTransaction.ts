'use client'

import { useState, useCallback, useRef } from 'react'
import { convertQuoteToRoute, executeRoute } from '@lifi/sdk'
import type { Route, LiFiStep } from '@lifi/sdk'

export type StakeTransactionStatus =
  | 'idle'
  | 'fetching-quote'
  | 'show-quote'
  | 'waiting-signature'
  | 'pending'
  | 'success'
  | 'error'

// Keep the same external shape as before so StakeModal needs no changes
export interface StakeQuoteParams {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  fromAddress: string
  toAddress: string
  fromAmount: string
  action: 'stake' | 'unstake'
  slippage?: number
}

export interface StakeQuote {
  estimate: {
    toAmount: string
    toAmountMin: string
    gasCosts: { type: string; price: string; estimate: string; limit: string; amount: string; amountUSD: string; token: unknown }[]
    feeCosts: { name: string; description?: string; percentage: string; token: unknown; amount: string; amountUSD: string; included: boolean }[]
    executionDuration: number
  }
  action: {
    fromChainId: number
    toChainId: number
    fromToken: unknown
    toToken: unknown
    fromAmount: string
  }
  tool: string
  toolDetails: { name: string; logoURI: string }
}

export interface UseStakeTransactionResult {
  quote: StakeQuote | null
  txHash: string | null
  status: StakeTransactionStatus
  error: string | null
  fetchQuote: (params: StakeQuoteParams) => Promise<void>
  executeTransaction: () => Promise<void>
  reset: () => void
}

function stepToQuote(step: LiFiStep): StakeQuote {
  return {
    estimate: {
      toAmount: step.estimate.toAmount,
      toAmountMin: step.estimate.toAmountMin,
      gasCosts: (step.estimate.gasCosts ?? []) as StakeQuote['estimate']['gasCosts'],
      feeCosts: (step.estimate.feeCosts ?? []) as StakeQuote['estimate']['feeCosts'],
      executionDuration: step.estimate.executionDuration,
    },
    action: {
      fromChainId: step.action.fromChainId,
      toChainId: step.action.toChainId,
      fromToken: step.action.fromToken,
      toToken: step.action.toToken,
      fromAmount: step.action.fromAmount,
    },
    tool: step.tool,
    toolDetails: step.toolDetails as StakeQuote['toolDetails'],
  }
}

export function useStakeTransaction(): UseStakeTransactionResult {
  const [status, setStatus] = useState<StakeTransactionStatus>('idle')
  const [quote, setQuote] = useState<StakeQuote | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const routeRef = useRef<Route | null>(null)
  const txHashRef = useRef<string | null>(null)
  const lastParamsRef = useRef<StakeQuoteParams | null>(null)

  const fetchQuote = useCallback(async (params: StakeQuoteParams) => {
    setStatus('fetching-quote')
    setError(null)
    setQuote(null)
    routeRef.current = null
    lastParamsRef.current = params

    try {
      const searchParams = new URLSearchParams({
        fromChain: String(params.fromChain),
        toChain: String(params.toChain),
        fromToken: params.fromToken,
        toToken: params.toToken,
        fromAmount: params.fromAmount,
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        slippage: String(params.slippage ?? 0.01),
      })

      const res = await fetch(`/api/composer/quote?${searchParams.toString()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message ?? `Quote request failed (${res.status})`)
      }
      const sdkQuote = await res.json()

      const route = convertQuoteToRoute(sdkQuote)
      routeRef.current = route

      // Map first step to our display shape
      const firstStep = route.steps[0]
      if (!firstStep) throw new Error('No steps in route')

      setQuote(stepToQuote(firstStep))
      setStatus('show-quote')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
    }
  }, [])

  const executeTransaction = useCallback(async () => {
    const params = lastParamsRef.current
    if (!params) return

    setStatus('waiting-signature')
    setError(null)

    try {
      // Always refresh quote before executing to avoid Permit2 expiry
      const searchParams = new URLSearchParams({
        fromChain: String(params.fromChain),
        toChain: String(params.toChain),
        fromToken: params.fromToken,
        toToken: params.toToken,
        fromAmount: params.fromAmount,
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        slippage: String(params.slippage ?? 0.01),
      })
      const res = await fetch(`/api/composer/quote?${searchParams.toString()}`)
      if (!res.ok) throw new Error(`Failed to refresh quote (${res.status})`)
      const freshQuote = await res.json()
      const route = convertQuoteToRoute(freshQuote)
      routeRef.current = route

      const executedRoute = await executeRoute(route, {
        updateRouteHook(updatedRoute) {
          const step = updatedRoute.steps[0]
          const processes = step?.execution?.process ?? []
          const last = processes[processes.length - 1]

          if (!last) return

          // Extract txHash as soon as it appears
          if (last.txHash && !txHashRef.current) {
            txHashRef.current = last.txHash
            setTxHash(last.txHash)
            setStatus('pending')
          }

          if (last.status === 'FAILED') {
            setStatus('error')
            setError(last.error?.message ?? 'Transaction failed')
          }
        },
      })

      // Final check — all steps done
      const allDone = executedRoute.steps.every(
        s => s.execution?.status === 'DONE'
      )
      if (allDone) {
        setStatus('success')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction was rejected or failed'
      setStatus('error')
      setError(message)
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setQuote(null)
    routeRef.current = null
    txHashRef.current = null
    setTxHash(null)
    setError(null)
  }, [])

  return { quote, txHash, status, error, fetchQuote, executeTransaction, reset }
}
