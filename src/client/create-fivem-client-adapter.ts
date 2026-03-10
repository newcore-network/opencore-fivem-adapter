import { IPedAppearanceClient } from '../../../opencore-framework/dist/adapters/contracts/client/IPedAppearanceClient'
import { IHasher } from '../../../opencore-framework/dist/adapters/contracts/IHasher'
import { defineClientAdapter, IClientLocalPlayerBridge, IClientRuntimeBridge, type OpenCoreClientAdapter } from '@open-core/framework/client'
import { FiveMHasher } from '../server/fivem-hasher'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMLocalPlayerBridge } from './fivem-local-player-bridge'
import { FiveMPedAppearanceClientAdapter } from './fivem-ped-appearance-client'
import { FiveMRuntimeBridge } from './fivem-runtime-bridge'

/**
 * Creates the external FiveM client adapter.
 */
export function createFiveMClientAdapter(): OpenCoreClientAdapter {
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
