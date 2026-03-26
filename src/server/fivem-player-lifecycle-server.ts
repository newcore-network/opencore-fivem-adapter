import { inject, injectable, type InjectionToken } from 'tsyringe'
import { EventsAPI } from '@open-core/framework/contracts'
import { SYSTEM_EVENTS } from '@open-core/framework'
import {
  IPlayerLifecycleServer,
  type RespawnPlayerRequest,
  type SpawnPlayerRequest,
  type TeleportPlayerRequest,
} from '@open-core/framework/contracts/server'

@injectable()
export class FiveMPlayerLifecycleServer extends IPlayerLifecycleServer {
  constructor(@inject(EventsAPI as InjectionToken<EventsAPI<'server'>>) private readonly events: EventsAPI<'server'>) {
    super()
  }

  spawn(playerSrc: string, request: SpawnPlayerRequest): void {
    const target = this.resolveTarget(playerSrc)
    if (!target) return

    this.events.emit(SYSTEM_EVENTS.spawner.spawn, target, {
      position: request.position,
      model: request.model,
      heading: request.heading,
      appearance: request.appearance,
    })
  }

  teleport(playerSrc: string, request: TeleportPlayerRequest): void {
    const target = this.resolveTarget(playerSrc)
    if (!target) return
    this.events.emit(SYSTEM_EVENTS.spawner.teleport, target, request.position, request.heading)
  }

  respawn(playerSrc: string, request: RespawnPlayerRequest): void {
    const target = this.resolveTarget(playerSrc)
    if (!target) return
    this.events.emit(SYSTEM_EVENTS.spawner.respawn, target, request.position, request.heading)
  }

  private resolveTarget(playerSrc: string) {
    const clientId = Number(playerSrc)
    return Number.isFinite(clientId) && clientId > 0 ? clientId : undefined
  }
}
