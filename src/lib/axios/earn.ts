import axios from 'axios'
import { config } from '@/config'

const earnApi = axios.create({
  baseURL: config.lifi.earn.baseUrl,
  timeout: 10000,
  headers: {
    'x-lifi-api-key': config.lifi.composer.apiKey,
  },
})

export default earnApi
