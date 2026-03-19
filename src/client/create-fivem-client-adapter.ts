import type { InjectionToken } from 'tsyringe'
import {
  defineClientAdapter,
  IClientWebViewBridge,
  IClientLocalPlayerBridge,
  IClientPlatformBridge,
  IClientRuntimeBridge,
  type OpenCoreClientAdapter,
} from '@open-core/framework/client'
import {
  IClientBlipBridge,
  IClientCameraPort,
  IClientMarkerBridge,
  IClientNotificationBridge,
  IClientSpawnBridge,
  IClientSpawnPort,
  IGtaPedAppearanceBridge,
} from '@open-core/framework/contracts/client'
import { FiveMMessagingTransport } from '../shared/transport/adapter'
import { FiveMClientHasher } from './fivem-hasher'
import { FiveMClientBlipBridge } from './fivem-blip-bridge'
import { FiveMClientCameraPort } from './fivem-camera-port'
import { FiveMLocalPlayerBridge } from './fivem-local-player-bridge'
import { FiveMClientMarkerBridge } from './fivem-marker-bridge'
import { FiveMClientNotificationBridge } from './fivem-notification-bridge'
import { FiveMClientPlatformBridge } from './fivem-platform-bridge'
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
        IGtaPedAppearanceBridge as InjectionToken<IGtaPedAppearanceBridge>,
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
        IClientPlatformBridge as InjectionToken<IClientPlatformBridge>,
        FiveMClientPlatformBridge,
      )
      ctx.bindSingleton(IClientCameraPort as InjectionToken<IClientCameraPort>, FiveMClientCameraPort)
      ctx.bindSingleton(
        IClientSpawnPort as InjectionToken<IClientSpawnPort>,
        FiveMClientSpawnBridge,
      )
      ctx.bindFactory(IClientSpawnBridge as InjectionToken<IClientSpawnBridge>, () =>
        ctx.container.resolve(IClientSpawnPort as InjectionToken<IClientSpawnPort>),
      )
      ctx.bindSingleton(IClientBlipBridge as InjectionToken<IClientBlipBridge>, FiveMClientBlipBridge)
      ctx.bindSingleton(
        IClientMarkerBridge as InjectionToken<IClientMarkerBridge>,
        FiveMClientMarkerBridge,
      )
      ctx.bindSingleton(
        IClientNotificationBridge as InjectionToken<IClientNotificationBridge>,
        FiveMClientNotificationBridge,
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
