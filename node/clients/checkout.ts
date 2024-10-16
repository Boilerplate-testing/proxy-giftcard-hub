import {
  ExternalClient,
  InstanceOptions,
  IOContext,
  IOResponse,
  RequestConfig,
  RequestTracingConfig
} from '@vtex/api'

import { statusToError } from '../utils'
import { createTracing } from '../utils/'

export class Checkout extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://angelamolano.vtexcommercestable.com.br/`, ctx, {
      ...options,
    })
  }

  public async getOrderForm(orderFormId: string, tracingConfig?: RequestTracingConfig) {

    let response: any = []
    let metric: string = 'GiftCard-GetOrderForm'

    if(orderFormId) {

      metric = 'GiftCard-Proxy-GET',

      response = await this.get(this.route.getOrderForm(orderFormId), {
        metric,
        tracing: createTracing(metric, tracingConfig),
      })
    } else {
      response = {}
    }

    return response

  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >

  private get route() {
    return {
      getOrderForm: (orderFormId: string) => `/api/checkout/pub/orderForm/${orderFormId}`,
    }
  }
}
