import axios from 'axios'
import { config } from '@/config'

const composerApi = axios.create({
  baseURL: config.lifi.composer.baseUrl,
  timeout: 10000,
  headers: {
    'x-lifi-api-key': config.lifi.composer.apiKey,
  },
})

export default composerApi
