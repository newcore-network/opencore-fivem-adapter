import { Vector3 } from '@open-core/framework'
import { IPlayerInfo } from '@open-core/framework'

export class FiveMPlayerInfo implements IPlayerInfo {
  getPlayerName(clientId: number): string | null {
    return GetPlayerName(clientId)
  }
  getPlayerPosition(clientId: number): Vector3 {
    const ped = GetPlayerPed(clientId)
    const [x, y, z] = GetEntityCoords(ped, false)
    return { x, y, z }
  }
}
