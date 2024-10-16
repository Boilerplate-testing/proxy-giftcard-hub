
import {
  Cached,
  ClientsConfig,
  LRUCache,
  ParamsContext,
  RecorderState,
  Service
} from '@vtex/api'

import { Clients } from './clients/'
import { prepare } from './middlewares/prepare'
import { providerProxy } from './resolvers/proxy'

process.env.DETERMINISTIC_VARY = 'true'

const TWO_SECONDS_MS =  2 * 1000
const FIVE_SECONDS_MS =  2.5 * TWO_SECONDS_MS
const LONG_SECONDS_MS =  20 * FIVE_SECONDS_MS

const vbaseCache = new LRUCache<string, Cached>({ max: 3000 })

metrics.trackCache('vbase', vbaseCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 1,
      timeout: LONG_SECONDS_MS,
    },
    vbase:{
      concurrency: 2,
      memoryCache: vbaseCache,
      timeout: TWO_SECONDS_MS,
    },
  },
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  routes: {
    giftcardProvider: [prepare, providerProxy],
  },
})
