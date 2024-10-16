export async function checkOrderForm(ctx: Context, body: any): Promise<boolean> {
 
  let callGiftCardProvider: boolean = true

  try {

    if(body?.cart) {

      const {
        cart: {
          shippingData,
        },
      } = body

      if(shippingData) {

        callGiftCardProvider = true

      } else {

        callGiftCardProvider = false
        
      }

    } else {

      callGiftCardProvider = false

    }

    return callGiftCardProvider

  } catch(error) {

    const { vtex: { logger } } = ctx

    const log = {
      appMessage: 'Error checking orderForm',
      message: error.message,
      stack: error.stack,
    }

    logger.error(log)
    
    return true

  }
}