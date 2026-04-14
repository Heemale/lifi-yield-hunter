'use client'

import { useState } from 'react'

interface ChainIconProps {
  chainId: number
  size?: number
  className?: string
  label?: string
}

const CDN = 'https://cdn.jsdelivr.net/gh/Amichain/chain-icons/svg'

export function ChainIcon({ chainId, size = 20, className, label }: ChainIconProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    const initials = label ? label.slice(0, 2).toUpperCase() : '?'
    return (
      <span
        className={className}
        style={{
          width: size, height: size, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', background: '#334155', color: '#94a3b8',
          fontSize: size * 0.4, fontWeight: 600,
        }}
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      src={`${CDN}/${chainId}.svg`}
      alt={label ?? String(chainId)}
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
