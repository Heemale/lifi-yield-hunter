export interface ProtocolInfo {
  name: string
  displayName: string
  url: string
}

export const PROTOCOLS: Record<string, ProtocolInfo> = {
  'aave-v3':        { name: 'aave-v3',        displayName: 'Aave V3',        url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x9d39a5de30e57443bff2a8307a4256c8797a3497&marketName=proto_mainnet_v3' },
  'ethena-usde':    { name: 'ethena-usde',    displayName: 'Ethena',         url: 'https://www.ethena.fi/' },
  'ether.fi-liquid':{ name: 'ether.fi-liquid',displayName: 'ether.fi Liquid',url: 'https://app.ether.fi/liquid/usd' },
  'ether.fi-stake': { name: 'ether.fi-stake', displayName: 'ether.fi Stake', url: 'https://ether.fi/app/weeth' },
  'euler-v2':       { name: 'euler-v2',       displayName: 'Euler V2',       url: 'https://app.euler.finance/vault/0x1905EDDF5943ef6C92Ccf1469bd40fC2cB4A77b0?network=monad' },
  'maple':          { name: 'maple',          displayName: 'Maple',          url: 'https://app.maple.finance/earn' },
  'morpho-v1':      { name: 'morpho-v1',      displayName: 'Morpho',         url: 'https://app.morpho.org/ethereum/vault/0xbeef009FF4FB1727297BF2526806F4A73E4b99aD' },
  'neverland':      { name: 'neverland',      displayName: 'Neverland',      url: 'https://app.neverland.money/markets?asset=USDC' },
  'pendle':         { name: 'pendle',         displayName: 'Pendle',         url: 'https://app.pendle.finance/trade/markets/0xc5b32dba5f29f8395fb9591e1a15f23a75214f33/swap?view=pt&chain=ethereum&py=output' },
  'upshift':        { name: 'upshift',        displayName: 'Upshift',        url: 'https://app.upshift.finance/pools/1/0xc824A08dB624942c5E5F330d56530cD1598859fD' },
  'yo-protocol':    { name: 'yo-protocol',    displayName: 'YO Protocol',    url: 'https://app.yo.xyz/vault/base/0x0000000f2eB9f69274678c76222B35eEc7588a65' },
}

export function getProtocolInfo(protocolName: string): ProtocolInfo {
  return PROTOCOLS[protocolName] ?? {
    name: protocolName,
    displayName: protocolName,
    url: '#',
  }
}
