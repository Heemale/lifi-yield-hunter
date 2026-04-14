export interface ComposerToken {
  address: string
  symbol: string
  decimals: number
  chainId: number
  name: string
  logoURI?: string
}

export interface GasCost {
  type: string
  price: string
  estimate: string
  limit: string
  amount: string
  amountUSD: string
  token: ComposerToken
}

export interface FeeCost {
  name: string
  description?: string
  percentage: string
  token: ComposerToken
  amount: string
  amountUSD: string
  included: boolean
}

export interface Quote {
  estimate: {
    toAmount: string
    toAmountMin: string
    gasCosts: GasCost[]
    feeCosts: FeeCost[]
    executionDuration: number
  }
  action: {
    fromChainId: number
    toChainId: number
    fromToken: ComposerToken
    toToken: ComposerToken
    fromAmount: string
  }
  transactionRequest: {
    to: string
    data: string
    value: string
    gasLimit: string
    gasPrice: string
    chainId: number
  }
  tool: string
  toolDetails: { name: string; logoURI: string }
}

export interface QuoteParams {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  fromAddress: string
  toAddress: string
  fromAmount: string
}

export interface StakeQuoteParams extends QuoteParams {
  action: 'stake' | 'unstake'
}

export type StakeQuote = Quote
