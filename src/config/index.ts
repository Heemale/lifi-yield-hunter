export const config = {
  ai: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY ?? '',
  },
  lifi: {
    common: {
      baseUrl: process.env.LIFI_COMMON_API_URL || 'https://li.quest',
    },
    earn: {
      baseUrl: process.env.LIFI_EARN_API_URL || 'https://earn.li.fi',
    },
    composer: {
      baseUrl: process.env.LIFI_COMPOSER_API_URL || 'https://li.quest',
      apiKey: process.env.LIFI_COMPOSER_API_KEY || '',
    },
  },
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY || '',
  },
} as const
