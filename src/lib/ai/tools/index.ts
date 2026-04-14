import { tool } from 'ai'
import { getTopVaults, getUserPortfolio } from '@/lib/ai/earn-queries'
import { getVaultsSchema, getPortfolioSchema } from './schemas'

export const earnTools = {
  getVaults: tool({
    description: '查询vault列表，支持按链筛选，按APY排序',
    inputSchema: getVaultsSchema,
    execute: ({ chainId, minApy }) => getTopVaults({ chainId, minApy }),
  }),

  getPortfolio: tool({
    description: '查询用户当前的持仓',
    inputSchema: getPortfolioSchema,
    execute: ({ address }) => getUserPortfolio(address),
  }),
}
