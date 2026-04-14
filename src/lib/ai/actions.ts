/**
 * AI action command protocol
 * Format: action-[key]-[value]
 * Examples:
 *   action-[yield-hunter:vault-chain-filter]-[8453]
 *   action-[yield-hunter:stake-modal]-[{"address":"0x...","chainId":8453,...}]
 *
 * NOTE: value is extracted by counting brackets to handle nested JSON correctly.
 */

const KEY_REGEX = /action-\[([^\]]+)\]-\[/g

export interface AIAction {
  key: string
  value: string
}

export const ACTION_KEYS = {
  CHAIN_FILTER: 'yield-hunter:vault-chain-filter',
  STAKE_MODAL: 'yield-hunter:stake-modal',
} as const

/**
 * Extract all action commands from an AI message text.
 * Uses bracket counting to correctly handle JSON values containing ']'.
 */
export function parseActions(text: string): AIAction[] {
  const actions: AIAction[] = []
  KEY_REGEX.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = KEY_REGEX.exec(text)) !== null) {
    const key = match[1]
    const valueStart = KEY_REGEX.lastIndex // position right after the opening '['

    // Count brackets to find the matching closing ']'
    let depth = 1
    let i = valueStart
    while (i < text.length && depth > 0) {
      if (text[i] === '[') depth++
      else if (text[i] === ']') depth--
      i++
    }

    if (depth === 0) {
      const value = text.slice(valueStart, i - 1)
      actions.push({ key, value })
      KEY_REGEX.lastIndex = i
    }
  }

  return actions
}

/** Strip action commands from text before rendering */
export function stripActions(text: string): string {
  // Remove full action lines: action-[key]-[value] including nested brackets
  const lines = text.split('\n')
  const filtered = lines.filter(line => {
    const trimmed = line.trim()
    return !trimmed.startsWith('action-[')
  })
  return filtered.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
