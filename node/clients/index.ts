import { IOClients } from '@vtex/api'

import { Checkout } from './checkout'
import { GiftCardProxy } from './giftCardProxy'

export class Clients extends IOClients {

  public get giftCardProxy() {
    return this.getOrSet('giftCardProxy', GiftCardProxy)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

}