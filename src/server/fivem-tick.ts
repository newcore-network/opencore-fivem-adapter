import { injectable } from 'tsyringe'
import { ITick } from '../../../opencore-framework/dist/adapters/contracts/ITick'

/**
 * FiveM implementation of ITick using native setTick
 */
@injectable()
export class FiveMTick implements ITick {
  setTick(handler: () => void | Promise<void>): void {
    setTick(handler)
  }
}
