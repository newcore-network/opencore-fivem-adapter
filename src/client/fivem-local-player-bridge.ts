import { injectable } from 'tsyringe'
import { IClientLocalPlayerBridge } from '@open-core/framework/client'
import { Vector3 } from '../../../opencore-framework/dist/kernel/utils/vector3'

/**
 * FiveM implementation of local player movement helpers.
 */
@injectable()
export class FiveMLocalPlayerBridge extends IClientLocalPlayerBridge {
  setPosition(position: Vector3, heading?: number): void {
    const ped = PlayerPedId()
    if (ped === 0) return

    SetEntityCoordsNoOffset(ped, position.x, position.y, position.z, false, false, false)

    if (typeof heading === 'number') {
      SetEntityHeading(ped, heading)
    }
  }
}
