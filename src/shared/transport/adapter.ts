import { FiveMEvents } from './fivem.events'
import { FiveMRpc } from './fivem.rpc'
import { MessagingTransport } from '@open-core/framework/contracts'

export class FiveMMessagingTransport extends MessagingTransport {
  readonly context = IsDuplicityVersion() ? 'server' : 'client'

  readonly events = new FiveMEvents(this.context)
  readonly rpc = new FiveMRpc(this.context)
}
