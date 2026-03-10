import {
  defineClientAdapter,
  IClientLocalPlayerBridge,
  IClientRuntimeBridge,
  type OpenCoreClientAdapter,
} from '@open-core/framework/client'
import { FiveMHasher } from '../server/fivem-hasher'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMLocalPlayerBridge } from './fivem-local-player-bridge'
import { FiveMPedAppearanceClientAdapter } from './fivem-ped-appearance-client'
import { FiveMRuntimeBridge } from './fivem-runtime-bridge'
import { IHasher, IPedAppearanceClient } from '@open-core/framework'

/**
 * Creates the external FiveM client adapter.
 */
export function FiveMClientAdapter(): OpenCoreClientAdapter {
  return defineClientAdapter({
    name: 'fivem',
    register(ctx) {
      ctx.bindMessagingTransport(new FiveMMessagingTransport())
      ctx.bindSingleton(IPedAppearanceClient as any, FiveMPedAppearanceClientAdapter)
      ctx.bindSingleton(IHasher as any, FiveMHasher)
      ctx.bindSingleton(IClientRuntimeBridge as any, FiveMRuntimeBridge)
      ctx.bindSingleton(IClientLocalPlayerBridge as any, FiveMLocalPlayerBridge)
    },
  })
}

/**
 * Backward-compatible factory name for external consumers.
 */
export const createFiveMClientAdapter = FiveMClientAdapter
