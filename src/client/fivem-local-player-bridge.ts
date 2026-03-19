import { injectable } from 'tsyringe'
import { IClientLocalPlayerBridge } from '@open-core/framework/client'
import type { Vector3 } from '@open-core/framework/kernel'

/**
 * FiveM implementation of local player movement helpers.
 */
@injectable()
export class FiveMLocalPlayerBridge extends IClientLocalPlayerBridge {
  getHandle(): number {
    return PlayerPedId()
  }

  getPosition(): Vector3 {
    const ped = this.getHandle()
    if (ped === 0) return { x: 0, y: 0, z: 0 }

    const [x, y, z] = GetEntityCoords(ped, false)
    return { x, y, z }
  }

  getHeading(): number {
    const ped = this.getHandle()
    if (ped === 0) return 0
    return GetEntityHeading(ped)
  }

  setPosition(position: Vector3, heading?: number): void {
    const ped = this.getHandle()
    if (ped === 0) return

    SetEntityCoordsNoOffset(ped, position.x, position.y, position.z, false, false, false)

    if (typeof heading === 'number') {
      SetEntityHeading(ped, heading)
    }
  }
}
