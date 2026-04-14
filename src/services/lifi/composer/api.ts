import { composerApi } from '@/lib/axios'
import type { Quote, QuoteParams, StakeQuote, StakeQuoteParams } from './types'

export async function getQuote(params: QuoteParams): Promise<Quote | null> {
  try {
    const { data } = await composerApi.get('/v1/quote', { params })
    return data as Quote
  } catch (e) {
    console.error('getQuote failed:', e)
    return null
  }
}

export async function getStakeQuote(params: StakeQuoteParams): Promise<StakeQuote | null> {
  try {
    const { data } = await composerApi.get('/v1/quote', { params })
    return data as StakeQuote
  } catch (e) {
    console.error('getStakeQuote failed:', e)
    return null
  }
}
