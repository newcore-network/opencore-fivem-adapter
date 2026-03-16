import { injectable } from 'tsyringe'
import {
  IClientBlipBridge,
  type ClientBlipDefinition,
} from '@open-core/framework/contracts/client'

@injectable()
export class FiveMClientBlipBridge extends IClientBlipBridge {
  private readonly blips = new Map<string, number>()
  private readonly definitions = new Map<string, ClientBlipDefinition>()

  create(id: string, definition: ClientBlipDefinition): void {
    this.remove(id)
    const handle = this.createHandle(definition)
    if (!handle) return
    this.blips.set(id, handle)
    this.definitions.set(id, { ...definition })
    this.apply(handle, definition)
  }

  update(id: string, patch: Partial<ClientBlipDefinition>): boolean {
    const current = this.definitions.get(id)
    if (!current) return false
    const next = { ...current, ...patch }
    const changedAnchor =
      patch.position !== undefined || patch.entity !== undefined || patch.radius !== undefined

    if (changedAnchor) {
      this.create(id, next)
      return this.exists(id)
    }

    const handle = this.blips.get(id)
    if (!handle) return false
    this.definitions.set(id, next)
    this.apply(handle, next)
    return true
  }

  exists(id: string): boolean {
    const handle = this.blips.get(id)
    return handle !== undefined && DoesBlipExist(handle)
  }

  remove(id: string): boolean {
    const handle = this.blips.get(id)
    if (handle === undefined) return false
    RemoveBlip(handle)
    this.blips.delete(id)
    this.definitions.delete(id)
    return true
  }

  clear(): void {
    for (const id of this.blips.keys()) this.remove(id)
  }

  private createHandle(definition: ClientBlipDefinition): number | null {
    if (definition.entity !== undefined) return AddBlipForEntity(definition.entity)
    if (definition.radius !== undefined && definition.position)
      return AddBlipForRadius(
        definition.position.x,
        definition.position.y,
        definition.position.z,
        definition.radius,
      )
    if (definition.position)
      return AddBlipForCoord(definition.position.x, definition.position.y, definition.position.z)
    return null
  }

  private apply(handle: number, definition: ClientBlipDefinition): void {
    if (definition.icon !== undefined) SetBlipSprite(handle, definition.icon)
    if (definition.color !== undefined) SetBlipColour(handle, definition.color)
    if (definition.scale !== undefined) SetBlipScale(handle, definition.scale)
    if (definition.shortRange !== undefined) SetBlipAsShortRange(handle, definition.shortRange)
    if (definition.alpha !== undefined) SetBlipAlpha(handle, definition.alpha)
    if (definition.route !== undefined) SetBlipRoute(handle, definition.route)
    if (definition.routeColor !== undefined) SetBlipRouteColour(handle, definition.routeColor)
    if (definition.visible !== undefined) SetBlipDisplay(handle, definition.visible ? 4 : 0)
    if (definition.position && definition.entity === undefined && definition.radius === undefined) {
      SetBlipCoords(handle, definition.position.x, definition.position.y, definition.position.z)
    }
    if (definition.label) {
      BeginTextCommandSetBlipName('STRING')
      AddTextComponentSubstringPlayerName(definition.label)
      EndTextCommandSetBlipName(handle)
    }
  }
}
