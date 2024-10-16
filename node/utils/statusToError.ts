import { AuthenticationError, ForbiddenError, UserInputError } from '@vtex/api'
import { AxiosError } from 'axios'

export function statusToError<T>(e: AxiosError): T {
  if (!e.response) {
    throw e
  }

  const { response } = e
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { status } = response!

  if (status === 401) {
    throw new AuthenticationError(e)
  }
  if (status === 403) {
    throw new ForbiddenError(e)
  }
  if (status === 400) {
    throw new UserInputError(e)
  }

  throw e
}