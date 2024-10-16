import {
  ExternalClient,
  InstanceOptions,
  IOContext,
  RequestConfig
} from '@vtex/api'

import { mock_BASE_URL, mock_PROVIDER_KEY, mock_PROVIDER_TOKEN } from '../constants'
import { statusToError } from '../utils'
import { createTracing } from '../utils/'

export class GiftCardProxy extends ExternalClient {
  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(mock_BASE_URL, ctx, {
      ...options,
      headers: {
        ...(options && options.headers),
        'x-provider-api-appkey': mock_PROVIDER_KEY,
        'x-provider-api-apptoken': mock_PROVIDER_TOKEN,
      },
    })
  }

  public proxyRequest = ({ reqMethod, path, body, tracingConfig }: IProxyReq) => {
    let metric: string = 'GiftCard-Proxy'

    const fullPath = `/${path}`

    if (reqMethod?.toLowerCase() === 'get') {

      metric = 'GiftCard-Proxy-GET'

      return this.get(fullPath, {
        metric,
        tracing: createTracing(metric, tracingConfig),
      })

    } else if (reqMethod?.toLowerCase() === 'put') {

      metric = 'GiftCard-Proxy-PUT'

      return this.put(fullPath, body, {
        metric,
        tracing: createTracing(metric, tracingConfig),
      })

    } else if (reqMethod?.toLowerCase() === 'post') {

      metric = 'GiftCard-Proxy-POST'

      return this.post(fullPath, body, {
        metric,
        tracing: createTracing(metric, tracingConfig),
      })

    } else if (reqMethod?.toLowerCase() === 'delete') {

      metric = 'GiftCard-Proxy-DELETE'

      return this.delete(fullPath, {
        metric,
        tracing: createTracing(metric, tracingConfig),
      })

    } else {
      return new Promise((resolve, reject) => {
        resolve(null)
        reject(null)
      })
    }

  }

  protected get = <T = any>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected put = <T = any>(url: string, data?: any, config?: RequestConfig) =>
    this.http.put<T>(url, data, config).catch(statusToError) as Promise<T>

  protected post = <T = any>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch(statusToError) as Promise<T>

  protected delete = <T = any>(url: string, config?: RequestConfig) =>
    this.http.delete<T>(url, config).catch(statusToError) as Promise<T>

  // private get request() {
  //   return {
  //     getFullPath: (type: string, path: string) => `${type}/${path}`,
  //   }
  // }

}
