import { json } from 'co-body'

import { handleValeTroca } from '../handlers'

export async function providerProxy(ctx: Context) {
  try {
    const {
      vtex: {
        route: {
          params,
        },
      },
      vtex: {
        logger,
      },
      req: {
        method: reqMethod,
      },
    } = ctx

    let isSearch: boolean = false
    let isTransaction: boolean = false
    let isCreatGiftCard: boolean = false

    const body: any = await json(ctx.req)
    const provider: string = params.provider as string
    const path: string = params.path as string

    isSearch = path.toLowerCase().includes('_search')

    isTransaction = path.toLowerCase().includes('transactions')

    isCreatGiftCard = reqMethod?.toLowerCase() === 'post' && path.endsWith('giftcard')

    const data: IHandleData = {
      body,
      isCreatGiftCard,
      isSearch,
      isTransaction,
      path,
      provider,
    }

    const response = await handleValeTroca(ctx, data)
    logger.info(`Success giftcard response`)

    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.status = 200
    ctx.body = response

  } catch(error) {
    const {
      vtex: {
        route: {
          params,
        },
      },
      req: {
        method: reqMethod,
      },
      vtex: {
        logger,
      },
    } = ctx

    let isSearch: boolean = false
    let isTransaction: boolean = false
    let body: any = null
    let appMessage: string = ''
    let stackTrace: any = null
    let log: object = {}
    const reqBody: any = await json(ctx.req)

    const path = params.path as string
    const method = reqMethod?.toLowerCase() as string
    const giftCardID = reqBody?.redemptionCode
    const paymentId = reqBody?.requestId
    const orderId = reqBody?.orderInfo?.orderId
    const userEmail = reqBody?.clientProfile?.email || reqBody?.client?.email
    const orderFormId = reqBody?.cart?.id

    isSearch = path.toLowerCase().includes('_search')

    isTransaction = path.toLowerCase().endsWith('/transactions')

    if(method === 'get') {
      body = null
    } else {
      body = isSearch || isTransaction ? [] : {}
    }

    if (error.isAxiosError) {
      appMessage = `Request to giftcard provider failed with status ${error.response?.status}`
    } else {
      appMessage = 'Unhandled exception'
      stackTrace = error.stack
    }

    log = {
      appMessage,
      config: error.response?.config,
      data: error.response?.data,
      giftCardID,
      message: error.message,
      orderFormId,
      orderId,
      paymentId,
      stackTrace,
      status: error.response?.status,
      statusText: error.response?.statusText,
      userEmail,
    }

    logger.error(log)

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.body = body

  }
}
