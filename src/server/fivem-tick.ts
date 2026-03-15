import { injectable } from 'tsyringe'
import { ITick } from '@open-core/framework/contracts/server'

/**
 * FiveM implementation of ITick using native setTick
 */
@injectable()
export class FiveMTick implements ITick {
  setTick(handler: () => void | Promise<void>): void {
    setTick(handler)
  }
}
