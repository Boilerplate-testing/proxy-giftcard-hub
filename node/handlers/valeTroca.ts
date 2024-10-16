import { VALE_TROCA_BUCKET } from '../constants'
import { checkOrderForm, staleFromVBaseWhileRevalidate } from '../utils'

export async function handleValeTroca(ctx: Context, data: IHandleData): Promise<any> {
  const {
    clients: { giftCardProxy, vbase },
    vtex: { logger },
    req: {
      method: reqMethod,
    },
  } = ctx

  const {
    isCreatGiftCard,
    isSearch,
    isTransaction,
    path,
    provider,
    body,
  } = data

  let callGiftCardProvider: boolean = true
  let response: any = []

  const params = { reqMethod, provider, path, body } as IProxyReq
  const isGet = reqMethod?.toLowerCase() === 'get' || false as boolean

  if(!isTransaction || !isCreatGiftCard) {

    if(isSearch) {
      callGiftCardProvider = await checkOrderForm(ctx, body)
    }

    if(callGiftCardProvider) {
      const email = body?.client?.email as string
      const document = body?.client?.document as string
      const cacheKey = email && document && `${email}-${document}` as string

      console.log('cacheKey', cacheKey)
      console.log('isSearch', isSearch)
      if (cacheKey && isSearch) {
        console.log('####if1')
        response =  await staleFromVBaseWhileRevalidate(
          vbase,
          VALE_TROCA_BUCKET,
          cacheKey,
          giftCardProxy.proxyRequest,
          params,
          logger,
          provider
        )

      } else if(isGet && !isSearch) {
        console.log('#### elseif1')
        response =  await staleFromVBaseWhileRevalidate(
          vbase,
          VALE_TROCA_BUCKET,
          path,
          giftCardProxy.proxyRequest,
          params,
          logger,
          provider
        )

      } else {
        console.log('#### else1')
        response = await giftCardProxy.proxyRequest(params)

      }

    } else {
      console.log('#### else2')
      response = isSearch || isTransaction ? [] : {}

    }

  } else {
    console.log('#### else3')
    response = await giftCardProxy.proxyRequest(params)
    console.log('response', response)
  }

  if(!callGiftCardProvider) {
    logger.info('ValeTroca proxy call saved')
  } else {
    logger.info(`Proxy called for ValeTroca`)
  }

  return response

}
