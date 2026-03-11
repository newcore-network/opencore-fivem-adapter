import { defineServerAdapter, type OpenCoreServerAdapter } from '@open-core/framework/server'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMPlatformContext } from './fivem-capabilities'
import { FiveMEngineEvents } from './fivem-engine-events'
import { FiveMEntityServer } from './fivem-entity-server'
import { FiveMExports } from './fivem-exports'
import { FiveMHasher } from './fivem-hasher'
import { FiveMPedAppearanceServerAdapter } from './fivem-ped-appearance-server'
import { FiveMPedServer } from './fivem-ped-server'
import { FiveMPlayerInfo } from './fivem-playerinfo'
import { FiveMPlayerServer } from './fivem-player-server'
import { FiveMResourceInfo } from './fivem-resourceinfo'
import { FiveMTick } from './fivem-tick'
import { FiveMVehicleServer } from './fivem-vehicle-server'
import {
  IPlatformContext,
  IEngineEvents,
  IExports,
  IResourceInfo,
  ITick,
  IPlayerInfo,
  IEntityServer,
  IPedServer,
  IVehicleServer,
  IPlayerServer,
  IHasher,
  IPedAppearanceServer,
} from '@open-core/framework'

/**
 * Creates the external FiveM server adapter.
 */
export function FiveMServerAdapter(): OpenCoreServerAdapter {
  return defineServerAdapter({
    name: 'fivem',
    register(ctx) {
      ctx.bindMessagingTransport(new FiveMMessagingTransport())
      ctx.bindSingleton(IPlatformContext as any, FiveMPlatformContext)
      ctx.bindSingleton(IEngineEvents as any, FiveMEngineEvents)
      ctx.bindSingleton(IExports as any, FiveMExports)
      ctx.bindSingleton(IResourceInfo as any, FiveMResourceInfo)
      ctx.bindSingleton(ITick as any, FiveMTick)
      ctx.bindSingleton(IPlayerInfo as any, FiveMPlayerInfo)
      ctx.bindSingleton(IEntityServer as any, FiveMEntityServer)
      ctx.bindSingleton(IPedServer as any, FiveMPedServer)
      ctx.bindSingleton(IVehicleServer as any, FiveMVehicleServer)
      ctx.bindSingleton(IPlayerServer as any, FiveMPlayerServer)
      ctx.bindSingleton(IHasher as any, FiveMHasher)
      ctx.bindSingleton(IPedAppearanceServer as any, FiveMPedAppearanceServerAdapter)
    },
  })
}

/**
 * Backward-compatible factory name for external consumers.
 */
export const createFiveMServerAdapter = FiveMServerAdapter
