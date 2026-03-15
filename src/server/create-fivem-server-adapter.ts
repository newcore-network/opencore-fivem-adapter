import type { InjectionToken } from 'tsyringe'
import { defineServerAdapter, type OpenCoreServerAdapter } from '@open-core/framework/server'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMPlatformContext } from './fivem-capabilities'
import { FiveMEngineEvents } from './fivem-engine-events'
import { FiveMEntityServer } from './fivem-entity-server'
import { FiveMExports } from './fivem-exports'
import { FiveMHasher } from './fivem-hasher'
import { FiveMNpcLifecycleServer } from './fivem-npc-lifecycle-server'
import { FiveMPedAppearanceServerAdapter } from './fivem-ped-appearance-server'
import { FiveMPedServer } from './fivem-ped-server'
import { FiveMPlayerAppearanceLifecycleServer } from './fivem-player-appearance-lifecycle-server'
import { FiveMPlayerLifecycleServer } from './fivem-player-lifecycle-server'
import { FiveMPlayerInfo } from './fivem-playerinfo'
import { FiveMPlayerStateSyncServer } from './fivem-player-state-sync-server'
import { FiveMPlayerServer } from './fivem-player-server'
import { FiveMResourceInfo } from './fivem-resourceinfo'
import { FiveMTick } from './fivem-tick'
import { FiveMVehicleLifecycleServer } from './fivem-vehicle-lifecycle-server'
import { FiveMVehicleServer } from './fivem-vehicle-server'
import {
  IPlatformContext,
  IEngineEvents,
  IExports,
  IResourceInfo,
  ITick,
  IPlayerInfo,
  IEntityServer,
  INpcLifecycleServer,
  IPedServer,
  IVehicleServer,
  IPlayerLifecycleServer,
  IPlayerStateSyncServer,
  IVehicleLifecycleServer,
  IPlayerServer,
  IPlayerAppearanceLifecycleServer,
  IHasher,
  IPedAppearanceServer,
} from '@open-core/framework/contracts/server'

/**
 * Creates the external FiveM server adapter.
 */
export function FiveMServerAdapter(): OpenCoreServerAdapter {
  return defineServerAdapter({
    name: 'fivem',
    register(ctx) {
      ctx.bindMessagingTransport(new FiveMMessagingTransport())
      ctx.bindSingleton(IPlatformContext as InjectionToken<IPlatformContext>, FiveMPlatformContext)
      ctx.bindSingleton(IEngineEvents as InjectionToken<IEngineEvents>, FiveMEngineEvents)
      ctx.bindSingleton(IExports as InjectionToken<IExports>, FiveMExports)
      ctx.bindSingleton(IResourceInfo as InjectionToken<IResourceInfo>, FiveMResourceInfo)
      ctx.bindSingleton(ITick as InjectionToken<ITick>, FiveMTick)
      ctx.bindSingleton(IPlayerInfo as InjectionToken<IPlayerInfo>, FiveMPlayerInfo)
      ctx.bindSingleton(IEntityServer as InjectionToken<IEntityServer>, FiveMEntityServer)
      ctx.bindSingleton(
        INpcLifecycleServer as InjectionToken<INpcLifecycleServer>,
        FiveMNpcLifecycleServer,
      )
      ctx.bindSingleton(IPedServer as InjectionToken<IPedServer>, FiveMPedServer)
      ctx.bindSingleton(IVehicleServer as InjectionToken<IVehicleServer>, FiveMVehicleServer)
      ctx.bindSingleton(
        IVehicleLifecycleServer as InjectionToken<IVehicleLifecycleServer>,
        FiveMVehicleLifecycleServer,
      )
      ctx.bindSingleton(
        IPlayerLifecycleServer as InjectionToken<IPlayerLifecycleServer>,
        FiveMPlayerLifecycleServer,
      )
      ctx.bindSingleton(
        IPlayerAppearanceLifecycleServer as InjectionToken<IPlayerAppearanceLifecycleServer>,
        FiveMPlayerAppearanceLifecycleServer,
      )
      ctx.bindSingleton(
        IPlayerStateSyncServer as InjectionToken<IPlayerStateSyncServer>,
        FiveMPlayerStateSyncServer,
      )
      ctx.bindSingleton(IPlayerServer as InjectionToken<IPlayerServer>, FiveMPlayerServer)
      ctx.bindSingleton(IHasher as InjectionToken<IHasher>, FiveMHasher)
      ctx.bindSingleton(
        IPedAppearanceServer as InjectionToken<IPedAppearanceServer>,
        FiveMPedAppearanceServerAdapter,
      )
    },
  })
}

/**
 * Backward-compatible factory name for external consumers.
 */
export const createFiveMServerAdapter = FiveMServerAdapter
