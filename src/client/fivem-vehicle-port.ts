import { inject, injectable } from 'tsyringe'
import {
  type ClientVehicleMods,
  type ClientVehicleSpawnOptions,
  IClientLocalPlayerBridge,
  IClientVehiclePort,
} from '@open-core/framework/contracts/client'
import type { Vector3 } from '@open-core/framework/kernel'

@injectable()
export class FiveMClientVehiclePort extends IClientVehiclePort {
  constructor(@inject(IClientLocalPlayerBridge as any) private readonly localPlayer: IClientLocalPlayerBridge) {
    super()
  }

  async spawn(options: ClientVehicleSpawnOptions): Promise<number> {
    const {
      model,
      position,
      heading = 0,
      placeOnGround = true,
      warpIntoVehicle = false,
      seatIndex = -1,
      primaryColor,
      secondaryColor,
      plate,
      networked = true,
    } = options

    const modelHash = GetHashKey(model)
    if (!IsModelInCdimage(modelHash) || !IsModelAVehicle(modelHash)) {
      throw new Error(`Invalid vehicle model: ${model}`)
    }

    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
      await new Promise((r) => setTimeout(r, 0))
    }

    const vehicle = CreateVehicle(modelHash, position.x, position.y, position.z, heading, networked, false)
    SetModelAsNoLongerNeeded(modelHash)
    if (!vehicle || vehicle === 0) throw new Error('Failed to create vehicle')

    if (placeOnGround) SetVehicleOnGroundProperly(vehicle)
    if (primaryColor !== undefined || secondaryColor !== undefined) {
      const [currentPrimary, currentSecondary] = GetVehicleColours(vehicle)
      SetVehicleColours(vehicle, primaryColor ?? currentPrimary, secondaryColor ?? currentSecondary)
    }
    if (plate) SetVehicleNumberPlateText(vehicle, plate)
    if (warpIntoVehicle) this.warpLocalPlayerInto(vehicle, seatIndex)

    return vehicle
  }

  delete(vehicle: number): void {
    if (!this.exists(vehicle)) return
    SetEntityAsMissionEntity(vehicle, true, true)
    DeleteVehicle(vehicle)
  }

  repair(vehicle: number): void {
    if (!this.exists(vehicle)) return
    SetVehicleFixed(vehicle)
    SetVehicleDeformationFixed(vehicle)
    SetVehicleUndriveable(vehicle, false)
    SetVehicleEngineOn(vehicle, true, true, false)
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehiclePetrolTankHealth(vehicle, 1000.0)
  }

  setFuel(vehicle: number, level: number): void {
    if (!this.exists(vehicle)) return
    SetVehicleFuelLevel(vehicle, Math.max(0, Math.min(100, level * 100)))
  }

  getFuel(vehicle: number): number {
    if (!this.exists(vehicle)) return 0
    return GetVehicleFuelLevel(vehicle) / 100
  }

  getClosest(radius = 10): number | null {
    const pos = this.localPlayer.getPosition()
    const vehicle = GetClosestVehicle(pos.x, pos.y, pos.z, radius, 0, 71)
    return vehicle !== 0 ? vehicle : null
  }

  isLocalPlayerInVehicle(): boolean {
    return IsPedInAnyVehicle(this.localPlayer.getHandle(), false)
  }

  getCurrentForLocalPlayer(): number | null {
    const ped = this.localPlayer.getHandle()
    if (!IsPedInAnyVehicle(ped, false)) return null
    return GetVehiclePedIsIn(ped, false)
  }

  getLastForLocalPlayer(): number | null {
    return GetVehiclePedIsIn(this.localPlayer.getHandle(), true)
  }

  isLocalPlayerDriver(vehicle: number): boolean {
    return GetPedInVehicleSeat(vehicle, -1) === this.localPlayer.getHandle()
  }

  warpLocalPlayerInto(vehicle: number, seatIndex = -1): void {
    if (!this.exists(vehicle)) return
    TaskWarpPedIntoVehicle(this.localPlayer.getHandle(), vehicle, seatIndex)
  }

  leaveLocalPlayerVehicle(vehicle: number, flags = 16): void {
    if (!this.exists(vehicle)) return
    TaskLeaveVehicle(this.localPlayer.getHandle(), vehicle, flags)
  }

  applyMods(vehicle: number, mods: ClientVehicleMods): void {
    if (!this.exists(vehicle)) return
    SetVehicleModKit(vehicle, 0)
    if (mods.spoiler !== undefined) SetVehicleMod(vehicle, 0, mods.spoiler, false)
    if (mods.frontBumper !== undefined) SetVehicleMod(vehicle, 1, mods.frontBumper, false)
    if (mods.rearBumper !== undefined) SetVehicleMod(vehicle, 2, mods.rearBumper, false)
    if (mods.sideSkirt !== undefined) SetVehicleMod(vehicle, 3, mods.sideSkirt, false)
    if (mods.exhaust !== undefined) SetVehicleMod(vehicle, 4, mods.exhaust, false)
    if (mods.frame !== undefined) SetVehicleMod(vehicle, 5, mods.frame, false)
    if (mods.grille !== undefined) SetVehicleMod(vehicle, 6, mods.grille, false)
    if (mods.hood !== undefined) SetVehicleMod(vehicle, 7, mods.hood, false)
    if (mods.fender !== undefined) SetVehicleMod(vehicle, 8, mods.fender, false)
    if (mods.rightFender !== undefined) SetVehicleMod(vehicle, 9, mods.rightFender, false)
    if (mods.roof !== undefined) SetVehicleMod(vehicle, 10, mods.roof, false)
    if (mods.engine !== undefined) SetVehicleMod(vehicle, 11, mods.engine, false)
    if (mods.brakes !== undefined) SetVehicleMod(vehicle, 12, mods.brakes, false)
    if (mods.transmission !== undefined) SetVehicleMod(vehicle, 13, mods.transmission, false)
    if (mods.horns !== undefined) SetVehicleMod(vehicle, 14, mods.horns, false)
    if (mods.suspension !== undefined) SetVehicleMod(vehicle, 15, mods.suspension, false)
    if (mods.armor !== undefined) SetVehicleMod(vehicle, 16, mods.armor, false)
    if (mods.turbo !== undefined) ToggleVehicleMod(vehicle, 18, mods.turbo)
    if (mods.xenon !== undefined) ToggleVehicleMod(vehicle, 22, mods.xenon)
    if (mods.wheelType !== undefined) SetVehicleWheelType(vehicle, mods.wheelType)
    if (mods.wheels !== undefined) SetVehicleMod(vehicle, 23, mods.wheels, false)
    if (mods.windowTint !== undefined) SetVehicleWindowTint(vehicle, mods.windowTint)
    if (mods.livery !== undefined) SetVehicleLivery(vehicle, mods.livery)
    if (mods.plateStyle !== undefined) SetVehicleNumberPlateTextIndex(vehicle, mods.plateStyle)
    if (mods.neonEnabled !== undefined) {
      SetVehicleNeonLightEnabled(vehicle, 0, mods.neonEnabled[0])
      SetVehicleNeonLightEnabled(vehicle, 1, mods.neonEnabled[1])
      SetVehicleNeonLightEnabled(vehicle, 2, mods.neonEnabled[2])
      SetVehicleNeonLightEnabled(vehicle, 3, mods.neonEnabled[3])
    }
    if (mods.neonColor !== undefined) {
      SetVehicleNeonLightsColour(vehicle, mods.neonColor[0], mods.neonColor[1], mods.neonColor[2])
    }
    if (mods.extras) {
      for (const [extraId, enabled] of Object.entries(mods.extras)) {
        SetVehicleExtra(vehicle, Number(extraId), !enabled)
      }
    }
    if (mods.pearlescentColor !== undefined || mods.wheelColor !== undefined) {
      const [currentPearl, currentWheel] = GetVehicleExtraColours(vehicle)
      SetVehicleExtraColours(vehicle, mods.pearlescentColor ?? currentPearl, mods.wheelColor ?? currentWheel)
    }
  }

  setDoorsLocked(vehicle: number, locked: boolean): void {
    if (!this.exists(vehicle)) return
    SetVehicleDoorsLocked(vehicle, locked ? 2 : 0)
  }

  setEngineRunning(vehicle: number, running: boolean, instant = false): void {
    if (!this.exists(vehicle)) return
    SetVehicleEngineOn(vehicle, running, instant, true)
  }

  setInvincible(vehicle: number, invincible: boolean): void {
    if (!this.exists(vehicle)) return
    SetEntityInvincible(vehicle, invincible)
  }

  getSpeed(vehicle: number): number {
    if (!this.exists(vehicle)) return 0
    return GetEntitySpeed(vehicle)
  }

  setHeading(vehicle: number, heading: number): void {
    if (!this.exists(vehicle)) return
    SetEntityHeading(vehicle, heading)
  }

  teleport(vehicle: number, position: Vector3, heading?: number): void {
    if (!this.exists(vehicle)) return
    SetEntityCoords(vehicle, position.x, position.y, position.z, false, false, false, false)
    if (heading !== undefined) SetEntityHeading(vehicle, heading)
    SetVehicleOnGroundProperly(vehicle)
  }

  exists(vehicle: number): boolean {
    return DoesEntityExist(vehicle)
  }

  getNetworkId(vehicle: number): number {
    if (!this.exists(vehicle)) return 0
    return NetworkGetNetworkIdFromEntity(vehicle)
  }

  getFromNetworkId(networkId: number): number {
    if (!NetworkDoesEntityExistWithNetworkId(networkId)) return 0
    return NetToVeh(networkId)
  }

  getState<T = unknown>(vehicle: number, key: string): T | undefined {
    if (!this.exists(vehicle)) return undefined
    return (Entity(vehicle).state as Record<string, T | undefined>)[key]
  }

  getPosition(vehicle: number): Vector3 | null {
    if (!this.exists(vehicle)) return null
    const [x, y, z] = GetEntityCoords(vehicle, false)
    return { x, y, z }
  }

  getHeading(vehicle: number): number {
    if (!this.exists(vehicle)) return 0
    return GetEntityHeading(vehicle)
  }

  getModel(vehicle: number): number {
    if (!this.exists(vehicle)) return 0
    return GetEntityModel(vehicle)
  }

  getPlate(vehicle: number): string {
    if (!this.exists(vehicle)) return ''
    return GetVehicleNumberPlateText(vehicle)
  }
}
