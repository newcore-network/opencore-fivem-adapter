import type { InjectionToken } from 'tsyringe'
import {
  defineClientAdapter,
  IClientWebViewBridge,
  PlatformNotificationBridge,
  IClientLocalPlayerBridge,
  IClientRuntimeBridge,
  type OpenCoreClientAdapter,
} from '@open-core/framework/client'
import {
  IClientBlipBridge,
  IClientMarkerBridge,
  IClientNotificationBridge,
  IClientSpawnBridge,
  IPedAppearanceClient,
} from '@open-core/framework/contracts/client'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMClientHasher } from './fivem-hasher'
import { FiveMClientBlipBridge } from './fivem-blip-bridge'
import { FiveMLocalPlayerBridge } from './fivem-local-player-bridge'
import { FiveMClientMarkerBridge } from './fivem-marker-bridge'
import { FiveMPedAppearanceClientAdapter } from './fivem-ped-appearance-client'
import { FiveMClientSpawnBridge } from './fivem-spawn-bridge'
import { FiveMRuntimeBridge } from './fivem-runtime-bridge'
import { FiveMClientWebViewBridge } from './fivem-webview-bridge'
import { IHasher } from '@open-core/framework/contracts'

/**
 * Creates the external FiveM client adapter.
 */
export function FiveMClientAdapter(): OpenCoreClientAdapter {
  return defineClientAdapter({
    name: 'fivem',
    register(ctx) {
      ctx.bindMessagingTransport(new FiveMMessagingTransport())
      ctx.bindSingleton(
        IPedAppearanceClient as InjectionToken<IPedAppearanceClient>,
        FiveMPedAppearanceClientAdapter,
      )
      ctx.bindSingleton(IHasher as InjectionToken<IHasher>, FiveMClientHasher)
      ctx.bindSingleton(
        IClientRuntimeBridge as InjectionToken<IClientRuntimeBridge>,
        FiveMRuntimeBridge,
      )
      ctx.bindSingleton(
        IClientLocalPlayerBridge as InjectionToken<IClientLocalPlayerBridge>,
        FiveMLocalPlayerBridge,
      )
      ctx.bindSingleton(
        IClientSpawnBridge as InjectionToken<IClientSpawnBridge>,
        FiveMClientSpawnBridge,
      )
      ctx.bindSingleton(IClientBlipBridge as InjectionToken<IClientBlipBridge>, FiveMClientBlipBridge)
      ctx.bindSingleton(
        IClientMarkerBridge as InjectionToken<IClientMarkerBridge>,
        FiveMClientMarkerBridge,
      )
      ctx.bindSingleton(
        IClientNotificationBridge as InjectionToken<IClientNotificationBridge>,
        PlatformNotificationBridge,
      )
      ctx.bindSingleton(
        IClientWebViewBridge as InjectionToken<IClientWebViewBridge>,
        FiveMClientWebViewBridge,
      )
    },
  })
}

/**
 * Backward-compatible factory name for external consumers.
 */
export const createFiveMClientAdapter = FiveMClientAdapter
