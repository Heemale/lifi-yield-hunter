import axios from 'axios'
import { config } from '@/config'

const earnApi = axios.create({
  baseURL: config.lifi.earn.baseUrl,
  timeout: 10000,
})

export default earnApi
