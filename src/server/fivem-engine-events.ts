import {
  IEngineEvents,
  RUNTIME_EVENTS,
  type RuntimeEventName,
} from '@open-core/framework/contracts/server'

export class FiveMEngineEvents extends IEngineEvents {
  override onRuntime<TArgs extends readonly unknown[]>(
    eventName: RuntimeEventName,
    handler?: (...args: TArgs) => void,
  ): void {
    if (!handler) return

    on(eventName, (...args: unknown[]) => {
      if (eventName === RUNTIME_EVENTS.playerJoining) {
        const clientId = Number(source)
        const license = GetPlayerIdentifier(clientId.toString(), 0) ?? undefined
        handler(...([clientId, { license }] as unknown as TArgs))
        return
      }

      if (eventName === RUNTIME_EVENTS.playerDropped) {
        const clientId = Number(source)
        handler(...([clientId] as unknown as TArgs))
        return
      }

      handler(...(args as unknown as TArgs))
    })
  }

  on<TArgs extends readonly unknown[]>(eventName: string, handler?: (...args: TArgs) => void): void {
    if (!handler) return
    on(eventName, (...args: unknown[]) => handler(...(args as unknown as TArgs)))
  }

  emit<TArgs extends readonly unknown[]>(eventName: string, ...args: TArgs): void {
    emit(eventName, ...(args as unknown as unknown[]))
  }
}
