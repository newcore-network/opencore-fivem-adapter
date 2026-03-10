import { EventsAPI } from '@open-core/framework'
import { RuntimeContext } from '@open-core/framework'
import { Player } from '@open-core/framework/server'

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

    if (target === 'all') send(-1)
    if (Array.isArray(target)) target.forEach(send)
    if (target instanceof Player) send(target.clientID)
    send(target)
  }
}
