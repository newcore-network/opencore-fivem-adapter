import { inject, injectable, type InjectionToken } from 'tsyringe'
import {
  type ClientPedAnimationOptions,
  type ClientPedSpawnOptions,
  IClientLocalPlayerBridge,
  IClientPedPort,
} from '@open-core/framework/contracts/client'
import type { Vector3 } from '@open-core/framework/kernel'

@injectable()
export class FiveMClientPedPort extends IClientPedPort {
  constructor(
    @inject(IClientLocalPlayerBridge as InjectionToken<IClientLocalPlayerBridge>)
    private readonly localPlayer: IClientLocalPlayerBridge,
  ) {
    super()
  }

  async spawn(options: ClientPedSpawnOptions): Promise<number> {
    const {
      model,
      position,
      heading = 0,
      networked = false,
      missionEntity = true,
      blockEvents = true,
      relationshipGroup = 'CIVMALE',
    } = options

    const modelHash = GetHashKey(model)
    if (!IsModelInCdimage(modelHash) || !IsModelValid(modelHash)) {
      throw new Error(`Invalid ped model: ${model}`)
    }

    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
      await new Promise((r) => setTimeout(r, 0))
    }

    const ped = CreatePed(
      4,
      modelHash,
      position.x,
      position.y,
      position.z,
      heading,
      networked,
      true,
    )
    SetModelAsNoLongerNeeded(modelHash)
    if (!ped || ped === 0) throw new Error('Failed to create ped')

    if (missionEntity) SetEntityAsMissionEntity(ped, true, true)
    if (blockEvents) SetBlockingOfNonTemporaryEvents(ped, true)
    SetPedRelationshipGroupHash(ped, GetHashKey(relationshipGroup))
    return ped
  }

  delete(handle: number): void {
    if (!this.exists(handle)) return
    SetEntityAsMissionEntity(handle, true, true)
    DeletePed(handle)
  }

  exists(handle: number): boolean {
    return DoesEntityExist(handle)
  }

  async playAnimation(handle: number, options: ClientPedAnimationOptions): Promise<void> {
    if (!this.exists(handle)) return
    RequestAnimDict(options.dict)
    while (!HasAnimDictLoaded(options.dict)) {
      await new Promise((r) => setTimeout(r, 0))
    }
    TaskPlayAnim(
      handle,
      options.dict,
      options.anim,
      options.blendInSpeed ?? 8,
      options.blendOutSpeed ?? -8,
      options.duration ?? -1,
      options.flags ?? 1,
      options.playbackRate ?? 0,
      false,
      false,
      false,
    )
  }

  stopAnimation(handle: number): void {
    if (this.exists(handle)) ClearPedTasks(handle)
  }
  stopAnimationImmediately(handle: number): void {
    if (this.exists(handle)) ClearPedTasksImmediately(handle)
  }
  freeze(handle: number, freeze: boolean): void {
    if (this.exists(handle)) FreezeEntityPosition(handle, freeze)
  }
  setInvincible(handle: number, invincible: boolean): void {
    if (this.exists(handle)) SetEntityInvincible(handle, invincible)
  }
  giveWeapon(handle: number, weapon: string, ammo = 100, hidden = false, forceInHand = true): void {
    if (!this.exists(handle)) return
    GiveWeaponToPed(handle, GetHashKey(weapon), ammo, hidden, forceInHand)
  }
  removeAllWeapons(handle: number): void {
    if (this.exists(handle)) RemoveAllPedWeapons(handle, true)
  }
  getClosest(radius = 10, excludeLocalPlayer = true): number | null {
    const origin = this.localPlayer.getPosition()
    const [found, handle] = GetClosestPed(
      origin.x,
      origin.y,
      origin.z,
      radius,
      true,
      true,
      true,
      false,
      -1,
    )
    if (!found || !handle) return null
    if (!handle) return null
    if (excludeLocalPlayer && handle === this.localPlayer.getHandle()) return null
    return handle
  }
  getNearby(position: Vector3, radius: number, excludeEntity?: number): number[] {
    const results: number[] = []
    const pool = GetGamePool('CPed') as number[]
    for (const ped of pool) {
      if (!DoesEntityExist(ped)) continue
      if (excludeEntity !== undefined && ped === excludeEntity) continue
      const [x, y, z] = GetEntityCoords(ped, false)
      const distance = GetDistanceBetweenCoords(position.x, position.y, position.z, x, y, z, true)
      if (distance <= radius) results.push(ped)
    }
    return results
  }
  lookAtEntity(handle: number, entity: number, duration = -1): void {
    if (this.exists(handle)) TaskLookAtEntity(handle, entity, duration, 2048, 3)
  }
  lookAtCoords(handle: number, position: Vector3, duration = -1): void {
    if (this.exists(handle))
      TaskLookAtCoord(handle, position.x, position.y, position.z, duration, 2048, 3)
  }
  walkTo(handle: number, position: Vector3, speed = 1): void {
    if (this.exists(handle))
      TaskGoStraightToCoord(handle, position.x, position.y, position.z, speed, -1, 0, 0)
  }
  setCombatAttributes(handle: number, canFight: boolean, canUseCover = true): void {
    if (!this.exists(handle)) return
    SetPedCombatAttributes(handle, 46, canFight)
    SetPedCombatAttributes(handle, 0, canUseCover)
  }
}
