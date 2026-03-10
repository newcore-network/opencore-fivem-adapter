import { EventsAPI } from '../../../../opencore-framework/dist/adapters/contracts/transport/events.api'
import { RuntimeContext } from '../../../../opencore-framework/dist/adapters/contracts/transport/context'
import { Player } from '../../../../opencore-framework/dist/runtime/server/entities/player'

export class FiveMEvents extends EventsAPI<RuntimeContext> {
  constructor(private readonly context: RuntimeContext) {
    super()
  }

  on(event: string, handler: any) {
    onNet(event, (...args: any) => {
      const sourceId = this.context === 'server' ? global.source : undefined
      handler({ clientId: sourceId, raw: sourceId }, ...args)
    })
  }

  emit(event: string, ...args: any[]): void {
    if (this.context !== 'server') {
      emitNet(event, ...args)
      return
    }
    const [target, ...payload] = args
    const send = (id: number) => emitNet(event, id, ...payload)

    if (target === 'all') return send(-1)
    if (Array.isArray(target)) return target.forEach(send)
    if (target instanceof Player) return send(target.clientID)
    send(target)
  }
}
