import { z } from 'zod'

export const getVaultsSchema = z.object({
  chainId: z.number().optional().describe('链ID，如8453=Base, 42161=Arbitrum, 1=Ethereum'),
  minApy: z.number().optional().describe('最低APY百分比'),
})

export const getPortfolioSchema = z.object({
  address: z.string().describe('用户钱包地址'),
})
