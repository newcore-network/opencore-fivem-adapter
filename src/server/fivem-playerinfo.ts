import { IPlayerInfo } from '@open-core/framework/contracts/server'
import { Vector3 } from '@open-core/framework/kernel'

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
