import axios from 'axios'
import { config } from '@/config'

const commonApi = axios.create({
  baseURL: config.lifi.common.baseUrl,
  timeout: 10000,
})

export default commonApi
