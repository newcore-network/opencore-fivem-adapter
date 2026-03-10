import { Vector3 } from '../../../opencore-framework/dist/kernel'
import { IPlayerInfo } from '../../../opencore-framework/dist/adapters/contracts/IPlayerInfo'

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
