import { IEngineEvents } from '../../../opencore-framework/dist/adapters/contracts/IEngineEvents'
import { IExports } from '../../../opencore-framework/dist/adapters/contracts/IExports'
import { IHasher } from '../../../opencore-framework/dist/adapters/contracts/IHasher'
import { IPlatformCapabilities } from '../../../opencore-framework/dist/adapters/contracts/IPlatformCapabilities'
import { IPlayerInfo } from '../../../opencore-framework/dist/adapters/contracts/IPlayerInfo'
import { IResourceInfo } from '../../../opencore-framework/dist/adapters/contracts/IResourceInfo'
import { ITick } from '../../../opencore-framework/dist/adapters/contracts/ITick'
import { IEntityServer } from '../../../opencore-framework/dist/adapters/contracts/server/IEntityServer'
import { IPedAppearanceServer } from '../../../opencore-framework/dist/adapters/contracts/server/IPedAppearanceServer'
import { IPedServer } from '../../../opencore-framework/dist/adapters/contracts/server/IPedServer'
import { IPlayerServer } from '../../../opencore-framework/dist/adapters/contracts/server/IPlayerServer'
import { IVehicleServer } from '../../../opencore-framework/dist/adapters/contracts/server/IVehicleServer'
import { defineServerAdapter, type OpenCoreServerAdapter } from '@open-core/framework/server'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMCapabilities } from './fivem-capabilities'
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

/**
 * Creates the external FiveM server adapter.
 */
export function createFiveMServerAdapter(): OpenCoreServerAdapter {
  return defineServerAdapter({
    name: 'fivem',
    register(ctx) {
      ctx.bindMessagingTransport(new FiveMMessagingTransport())
      ctx.bindSingleton(IPlatformCapabilities as any, FiveMCapabilities)
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
