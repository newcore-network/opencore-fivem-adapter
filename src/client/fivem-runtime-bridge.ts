import { injectable } from 'tsyringe'
import { IClientRuntimeBridge } from '@open-core/framework/client'

/**
 * FiveM implementation of the client runtime bridge.
 */
@injectable()
export class FiveMRuntimeBridge extends IClientRuntimeBridge {
  getCurrentResourceName(): string {
    const fn = GetCurrentResourceName
    if (typeof fn === 'function') {
      const name = fn()
      if (typeof name === 'string' && name.trim()) return name
    }
    return 'default'
  }

  on<TArgs extends readonly unknown[]>(
    eventName: string,
    handler: (...args: TArgs) => void | Promise<void>,
  ): void {
    on(eventName, (...args: unknown[]) => {
      void handler(...(args as unknown as TArgs))
    })
  }

  registerCommand(
    commandName: string,
    handler: (...args: unknown[]) => void,
    restricted: boolean,
  ): void {
    RegisterCommand(commandName, handler, restricted)
  }

  registerKeyMapping(
    commandName: string,
    description: string,
    inputMapper: string,
    key: string,
  ): void {
    RegisterKeyMapping(commandName, description, inputMapper, key)
  }

  setTick(handler: () => void | Promise<void>): unknown {
    return setTick(() => {
      void handler()
    })
  }

  clearTick(_handle: unknown): void {}

  getGameTimer(): number {
    return GetGameTimer()
  }

  registerNuiCallback(
    eventName: string,
    handler: (data: unknown, cb: (response: unknown) => void) => void | Promise<void>,
  ): void {
    RegisterNuiCallbackType(eventName)
    on(`__cfx_nui:${eventName}`, (data: unknown, cb: (response: unknown) => void) => {
      void handler(data, cb)
    })
  }

  sendNuiMessage(message: string): void {
    SendNuiMessage(message)
  }

  setNuiFocus(hasFocus: boolean, hasCursor: boolean): void {
    SetNuiFocus(hasFocus, hasCursor)
  }

  setNuiFocusKeepInput(keepInput: boolean): void {
    SetNuiFocusKeepInput(keepInput)
  }

  registerExport<TArgs extends readonly unknown[], TResult = unknown>(
    exportName: string,
    handler: (...args: TArgs) => TResult,
  ): void {
    exports(exportName, handler)
  }
}
