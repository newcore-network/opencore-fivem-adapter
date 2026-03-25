import { injectable } from 'tsyringe'
import { IClientPlatformBridge } from '@open-core/framework/contracts/client'

type CoreVector3 = { x: number; y: number; z: number }

@injectable()
export class FiveMClientPlatformBridge extends IClientPlatformBridge {
  override getLocalPlayerPed(): number {
    return PlayerPedId()
  }

  override getEntityCoords(entity: number): CoreVector3 {
    const [x, y, z] = GetEntityCoords(entity, false)
    return { x, y, z }
  }

  override getWorldPositionOfEntityBone(entity: number, bone: number): CoreVector3 {
    const [x, y, z] = GetWorldPositionOfEntityBone(entity, bone)
    return { x, y, z }
  }

  override getGameplayCamCoords(): CoreVector3 {
    const [x, y, z] = GetGameplayCamCoord()
    return { x, y, z }
  }

  override getDistanceBetweenCoords(a: CoreVector3, b: CoreVector3, useZ = true): number {
    return GetDistanceBetweenCoords(a.x, a.y, a.z, b.x, b.y, b.z, useZ)
  }

  override getHashKey(value: string): number {
    return GetHashKey(value)
  }

  override isModelInCdimage(hash: number): boolean {
    return IsModelInCdimage(hash)
  }

  override isModelValid(hash: number): boolean {
    return IsModelValid(hash)
  }

  override requestModel(hash: number): void {
    RequestModel(hash)
  }

  override hasModelLoaded(hash: number): boolean {
    return HasModelLoaded(hash)
  }

  override setModelAsNoLongerNeeded(hash: number): void {
    SetModelAsNoLongerNeeded(hash)
  }

  override setEntityAsMissionEntity(
    entity: number,
    mission: boolean,
    scriptHostObject: boolean,
  ): void {
    SetEntityAsMissionEntity(entity, mission, scriptHostObject)
  }

  override clearPedTasksImmediately(ped: number): void {
    ClearPedTasksImmediately(ped)
  }

  override removeAllPedWeapons(ped: number, includeCurrentWeapon: boolean): void {
    RemoveAllPedWeapons(ped, includeCurrentWeapon)
  }

  override resetEntityAlpha(entity: number): void {
    ResetEntityAlpha(entity)
  }

  override setEntityAlpha(entity: number, alphaLevel: number): void {
    SetEntityAlpha(entity, alphaLevel, false)
  }

  override setEntityVisible(entity: number, toggle: boolean): void {
    SetEntityVisible(entity, toggle, false)
  }

  override setEntityCollision(entity: number, toggle: boolean): void {
    SetEntityCollision(entity, toggle, true)
  }

  override setEntityInvincible(entity: number, toggle: boolean): void {
    SetEntityInvincible(entity, toggle)
  }

  override freezeEntityPosition(entity: number, toggle: boolean): void {
    FreezeEntityPosition(entity, toggle)
  }

  override setEntityCoordsNoOffset(entity: number, position: CoreVector3): void {
    SetEntityCoordsNoOffset(entity, position.x, position.y, position.z, false, false, false)
  }

  override setEntityHeading(entity: number, heading: number): void {
    SetEntityHeading(entity, heading)
  }

  override getEntityHeading(entity: number): number {
    return GetEntityHeading(entity)
  }

  override setEntityHealth(entity: number, health: number): void {
    SetEntityHealth(entity, health)
  }

  override getEntityMaxHealth(entity: number): number {
    return GetEntityMaxHealth(entity)
  }

  override isScreenFadedOut(): boolean {
    return IsScreenFadedOut()
  }

  override isScreenFadingOut(): boolean {
    return IsScreenFadingOut()
  }

  override doScreenFadeOut(ms: number): void {
    DoScreenFadeOut(ms)
  }

  override isScreenFadedIn(): boolean {
    return IsScreenFadedIn()
  }

  override isScreenFadingIn(): boolean {
    return IsScreenFadingIn()
  }

  override doScreenFadeIn(ms: number): void {
    DoScreenFadeIn(ms)
  }

  override networkIsSessionStarted(): boolean {
    return NetworkIsSessionStarted()
  }

  override networkResurrectLocalPlayer(position: CoreVector3, heading: number): void {
    NetworkResurrectLocalPlayer(position.x, position.y, position.z, heading, 0, false)
  }

  override playerId(): number {
    return PlayerId()
  }

  override setPlayerModel(playerId: number, modelHash: number): void {
    SetPlayerModel(playerId, modelHash)
  }

  override requestCollisionAtCoord(position: CoreVector3): void {
    RequestCollisionAtCoord(position.x, position.y, position.z)
  }

  override hasCollisionLoadedAroundEntity(entity: number): boolean {
    return HasCollisionLoadedAroundEntity(entity)
  }

  override shutdownLoadingScreen(): void {
    ShutdownLoadingScreen()
  }

  override shutdownLoadingScreenNui(): void {
    ShutdownLoadingScreenNui()
  }
}
