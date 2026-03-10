import { injectable } from 'tsyringe'
import { ITick } from '@open-core/framework'

/**
 * FiveM implementation of ITick using native setTick
 */
@injectable()
export class FiveMTick implements ITick {
  setTick(handler: () => void | Promise<void>): void {
    setTick(handler)
  }
}
