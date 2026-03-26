import { EventsAPI, type RuntimeContext } from '@open-core/framework/contracts'

function isPlayerTarget(value: unknown): value is { clientID: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'clientID' in value &&
    typeof (value as { clientID: unknown }).clientID === 'number'
  )
}

export class FiveMEvents extends EventsAPI<RuntimeContext> {
  constructor(private readonly context: RuntimeContext) {
    super()
  }

  on<TArgs extends readonly unknown[]>(
    event: string,
    handler: (ctx: { clientId?: number; raw?: unknown }, ...args: TArgs) => void | Promise<void>,
  ): void {
    onNet(event, (...args: unknown[]) => {
      const sourceId = this.context === 'server' ? source : undefined
      void handler({ clientId: sourceId, raw: sourceId }, ...(args as unknown as TArgs))
    })
  }

  emit(event: string, ...args: unknown[]): void {
    if (this.context !== 'server') {
      emitNet(event, ...args)
      return
    }
    const [target, ...payload] = args
    const send = (id: number) => emitNet(event, id, ...payload)

    if (target === 'all') {
      send(-1)
      return
    }
    if (Array.isArray(target)) {
      target.forEach(send)
      return
    }
    if (isPlayerTarget(target)) {
      send(target.clientID)
      return
    }
    if (typeof target === 'number') {
      send(target)
    }
  }
}
