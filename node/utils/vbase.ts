import { Logger, VBase } from '@vtex/api'
import { createHash } from 'crypto'
import { DEFAULT_GIFTCARD_CACHE } from '../constants'

export const staleFromVBaseWhileRevalidate = async <T>(
  vbase: VBase,
  bucket: string,
  filePath: string,
  validateFunction: (options: IProxyReq) => Promise<T>,
  params: IProxyReq,
  logger: Logger,
  provider: string,
  options?: { expirationInMinutes?: number }
): Promise<T> => {
  try {
    const normalizedFilePath = normalizedJSONFile(filePath)
    const cachedData = await vbase.getJSON<StaleRevalidateData<T>>(bucket, normalizedFilePath, true).catch((error) => console.log("error", error)) as StaleRevalidateData<T>
    const endDate = getTTL(options?.expirationInMinutes)

    const date = new Date();
    const now = new Date(date.getTime() + 3);

    if (!cachedData) {
      console.log("ifffff123")
      logger.info({
        cacheKey: normalizedFilePath,
        cacheStatus: 'MISS',
        message: 'No cached data',
        provider,
      })

      const res = await revalidate<T>(vbase, bucket, normalizedFilePath, endDate, validateFunction, params)
      return res
    } else if (now > new Date(cachedData.ttl)) {
      console.log("else ifffff")
      const res = await revalidate<T>(vbase, bucket, normalizedFilePath, endDate, validateFunction, params)
      return res
    } else {
      console.log("elseeeeeeee")
      const { data } = cachedData as StaleRevalidateData<T>
      console.log("data", data)

      logger.info({
        cacheKey: normalizedFilePath,
        cacheStatus: 'REVALIDATE',
        message: 'Cached data',
        provider,
      })

      // revalidate<T>(vbase, bucket, normalizedFilePath, endDate, validateFunction, params)

      return data
    }


  } catch (error) {

    logger.error({
      errorMessage: error.message,
      message: 'Stale cache error',
      provider,
    })

    return await validateFunction(params)
  }
}

const getTTL = (expirationInMinutes?: number) => {
  const ttl = new Date()
  ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes || DEFAULT_GIFTCARD_CACHE))

  return ttl
}

const revalidate = async<T>(
  vbase: VBase, bucket: string, filePath: string,
  endDate: Date, validateFunction: (params: IProxyReq) => Promise<T>,
  params: IProxyReq) => {

  const data = await validateFunction(params)

  if (data) {
    const revalidatedData = { data, ttl: endDate }
    console.log(revalidatedData, "revalidatedData123")
    vbase.saveJSON<StaleRevalidateData<T>>(bucket, filePath, revalidatedData).catch()
  }

  return data
}

const normalizedJSONFile = (filePath: string) => createHash('md5').update(filePath).digest('hex') + '.json'
