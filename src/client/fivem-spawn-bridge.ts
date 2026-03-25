import { inject, injectable, type InjectionToken } from 'tsyringe'
import {
  IClientSpawnPort,
  type RespawnRequest,
  type SpawnExecutionResult,
  type SpawnRequest,
  type TeleportRequest,
} from '@open-core/framework/contracts/client'
import { IClientPlatformBridge, IClientRuntimeBridge } from '@open-core/framework/contracts/client'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const NETWORK_TIMEOUT_MS = 15_000
const PED_TIMEOUT_MS = 10_000
const COLLISION_TIMEOUT_MS = 7_000
const SCREEN_FADE_TIMEOUT_MS = 2_000
const MODEL_LOAD_TIMEOUT_MS = 10_000

@injectable()
export class FiveMClientSpawnBridge extends IClientSpawnPort {
  constructor(
    @inject(IClientPlatformBridge as InjectionToken<IClientPlatformBridge>)
    private readonly platform: IClientPlatformBridge,
    @inject(IClientRuntimeBridge as InjectionToken<IClientRuntimeBridge>)
    private readonly runtime: IClientRuntimeBridge,
  ) {
    super()
  }

  async waitUntilReady(timeoutMs = NETWORK_TIMEOUT_MS): Promise<void> {
    const start = this.runtime.getGameTimer()
    while (!this.platform.networkIsSessionStarted()) {
      if (this.runtime.getGameTimer() - start > timeoutMs) {
        throw new Error('NETWORK_TIMEOUT')
      }
      await delay(0)
    }
  }

  async spawn(request: SpawnRequest): Promise<SpawnExecutionResult> {
    await this.fadeOutIfSupported()
    this.closeLoadingScreens()
    await this.setPlayerModel(request.model)

    const ped = await this.ensurePed()
    await this.ensureCollisionAt(request.position, ped)
    this.platform.networkResurrectLocalPlayer(request.position, request.heading ?? 0)

    const finalPed = await this.ensurePed()
    await this.setupPedForGameplay(finalPed)
    await this.placePed(finalPed, request.position, request.heading ?? 0)
    this.fadeInIfSupported()
    return { localPlayerHandle: finalPed }
  }

  async respawn(request: RespawnRequest): Promise<SpawnExecutionResult> {
    const ped = await this.ensurePed()
    await this.ensureCollisionAt(request.position, ped)
    this.platform.clearPedTasksImmediately(ped)
    this.platform.setEntityHealth(ped, this.platform.getEntityMaxHealth(ped))
    this.platform.networkResurrectLocalPlayer(request.position, request.heading ?? 0)
    const finalPed = await this.ensurePed()
    await this.setupPedForGameplay(finalPed)
    await this.placePed(finalPed, request.position, request.heading ?? 0)
    return { localPlayerHandle: finalPed }
  }

  async teleport(request: TeleportRequest): Promise<void> {
    const ped = await this.ensurePed()
    await this.ensureCollisionAt(request.position, ped)
    await this.placePed(
      ped,
      request.position,
      request.heading ?? this.platform.getEntityHeading(ped),
    )
  }

  private async fadeOutIfSupported(): Promise<void> {
    if (this.platform.isScreenFadedOut() || this.platform.isScreenFadingOut()) return
    this.platform.doScreenFadeOut(500)
    const started = this.runtime.getGameTimer()
    while (!this.platform.isScreenFadedOut()) {
      if (this.runtime.getGameTimer() - started > SCREEN_FADE_TIMEOUT_MS) break
      await delay(0)
    }
  }

  private fadeInIfSupported(): void {
    if (!this.platform.isScreenFadedIn() && !this.platform.isScreenFadingIn()) {
      this.platform.doScreenFadeIn(500)
    }
  }

  private closeLoadingScreens(): void {
    try {
      this.platform.shutdownLoadingScreen()
    } catch {}
    try {
      this.platform.shutdownLoadingScreenNui()
    } catch {}
  }

  private async setPlayerModel(model: string): Promise<void> {
    const modelHash = this.platform.getHashKey(model)
    if (!this.platform.isModelInCdimage(modelHash) || !this.platform.isModelValid(modelHash)) {
      throw new Error('MODEL_INVALID')
    }

    this.platform.requestModel(modelHash)
    const started = this.runtime.getGameTimer()
    while (!this.platform.hasModelLoaded(modelHash)) {
      if (this.runtime.getGameTimer() - started > MODEL_LOAD_TIMEOUT_MS) {
        throw new Error('MODEL_LOAD_TIMEOUT')
      }
      await delay(0)
    }

    this.platform.setPlayerModel(this.platform.playerId(), modelHash)
    this.platform.setModelAsNoLongerNeeded(modelHash)
  }

  private async ensurePed(): Promise<number> {
    const started = this.runtime.getGameTimer()
    let ped = this.platform.getLocalPlayerPed()
    while (ped === 0) {
      if (this.runtime.getGameTimer() - started > PED_TIMEOUT_MS) {
        throw new Error('PED_TIMEOUT')
      }
      await delay(0)
      ped = this.platform.getLocalPlayerPed()
    }
    return ped
  }

  private async ensureCollisionAt(
    position: TeleportRequest['position'],
    ped: number,
  ): Promise<void> {
    this.platform.requestCollisionAtCoord(position)
    const started = this.runtime.getGameTimer()
    while (!this.platform.hasCollisionLoadedAroundEntity(ped)) {
      if (this.runtime.getGameTimer() - started > COLLISION_TIMEOUT_MS) break
      await delay(0)
    }
  }

  private async setupPedForGameplay(ped: number): Promise<void> {
    this.platform.setEntityAsMissionEntity(ped, true, true)
    this.platform.clearPedTasksImmediately(ped)
    this.platform.removeAllPedWeapons(ped, true)
    this.platform.resetEntityAlpha(ped)
    await delay(0)
    this.platform.setEntityAlpha(ped, 255)
    this.platform.setEntityVisible(ped, true)
    this.platform.setEntityCollision(ped, true)
    this.platform.setEntityInvincible(ped, false)
  }

  private async placePed(
    ped: number,
    position: TeleportRequest['position'],
    heading: number,
  ): Promise<void> {
    this.platform.freezeEntityPosition(ped, true)
    this.platform.setEntityCoordsNoOffset(ped, position)
    this.platform.setEntityHeading(ped, heading)
    await delay(0)
    this.platform.freezeEntityPosition(ped, false)
  }
}
