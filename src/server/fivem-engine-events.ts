import {
  IEngineEvents,
  RUNTIME_EVENTS,
  type RuntimeEventName,
} from '@open-core/framework/contracts/server'

export class FiveMEngineEvents extends IEngineEvents {
  override onRuntime(eventName: RuntimeEventName, handler?: (...args: any[]) => void): void {
    if (!handler) return

    on(eventName, (...args: any[]) => {
      if (eventName === RUNTIME_EVENTS.playerJoining) {
        const clientId = Number(source)
        const license = GetPlayerIdentifier(clientId.toString(), 0) ?? undefined
        handler(clientId, { license })
        return
      }

      if (eventName === RUNTIME_EVENTS.playerDropped) {
        const clientId = Number(source)
        handler(clientId)
        return
      }

      handler(...args)
    })
  }

  on(eventName: string, handler?: (...args: any[]) => void): void {
    if (!handler) return
    on(eventName, (...args: any[]) => handler(...args))
  }

  emit(eventName: string, ...args: any[]): void {
    emit(eventName, ...args)
  }
}
