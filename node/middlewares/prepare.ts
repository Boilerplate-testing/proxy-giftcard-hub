import { AuthenticationError, ForbiddenError } from '@vtex/api'
import { VTEX_AUTH_HEADER_KEY, VTEX_AUTH_HEADER_TOKEN, VTEX_PROVIDER_HUB_KEY, VTEX_PROVIDER_HUB_TOKEN } from '../constants'

export async function prepare(
  ctx: Context,
  next: () => Promise<any>
) {

  const appKey = ctx.headers[VTEX_AUTH_HEADER_KEY]
  const appToken = ctx.headers[VTEX_AUTH_HEADER_TOKEN]

  if(!appKey || !appToken) {
    throw new AuthenticationError('No authorization provided')
  }

  if (appKey && appKey !== VTEX_PROVIDER_HUB_KEY) {
    throw new ForbiddenError('Not authorized')
  }

  if (appToken && appToken !== VTEX_PROVIDER_HUB_TOKEN) {
    throw new ForbiddenError('Not authorized')
  }

  await next()

}
