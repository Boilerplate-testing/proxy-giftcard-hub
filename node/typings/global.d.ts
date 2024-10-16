import { RequestTracingConfig, ServiceContext } from '@vtex/api'
import { Clients } from '../clients'

declare global {
  type Context = ServiceContext<Clients>

  interface StaleRevalidateData<T>{
    ttl: Date
    data: T
  }

  interface IHandleData {
    isCreatGiftCard: boolean
    isSearch: boolean
    isTransaction: boolean
    path: string
    provider: string
    body: any
  }

  interface IProxyReq {
    reqMethod: string
    provider: string
    path: string
    body: any
    tracingConfig?: RequestTracingConfig
  }
  
}