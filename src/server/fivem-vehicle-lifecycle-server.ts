import { inject, injectable } from 'tsyringe'
import { IPlatformContext } from '@open-core/framework/contracts/server'
import { IPlayerServer, IVehicleLifecycleServer, IVehicleServer } from '@open-core/framework/contracts/server'
import { EventsAPI } from '@open-core/framework/contracts'
import type {
  CreateVehicleServerRequest,
  CreateVehicleServerResult,
  WarpPlayerIntoVehicleRequest,
} from '@open-core/framework/contracts/server'

@injectable()
export class FiveMVehicleLifecycleServer extends IVehicleLifecycleServer {
  constructor(
    @inject(IVehicleServer as any) private readonly vehicleServer: IVehicleServer,
    @inject(IPlatformContext as any) private readonly platformContext: IPlatformContext,
    @inject(IPlayerServer as any) private readonly playerServer: IPlayerServer,
    @inject(EventsAPI as any) private readonly events: EventsAPI<'server'>,
  ) {
    super()
  }

  create(request: CreateVehicleServerRequest): CreateVehicleServerResult {
    if (!this.platformContext.enableServerVehicleCreation) {
      throw new Error(
        `Server vehicle creation is disabled for profile '${this.platformContext.gameProfile}'`,
      )
    }

    const handle = this.vehicleServer.createServerSetter(
      request.modelHash,
      this.platformContext.defaultVehicleType,
      request.position.x,
      request.position.y,
      request.position.z,
      request.heading,
    )

    if (!Number.isFinite(handle) || handle <= 0) {
      throw new Error('Failed to create vehicle entity')
    }

    return {
      handle,
      networkId: this.vehicleServer.getNetworkIdFromEntity(handle),
    }
  }

  warpPlayerIntoVehicle(request: WarpPlayerIntoVehicleRequest): void {
    const clientId = Number(request.playerSrc)
    if (Number.isNaN(clientId)) return

    const vehicle = this.vehicleServer.getEntityFromNetworkId(request.networkId)
    const ped = this.playerServer.getPed(request.playerSrc)
    if (!vehicle || !ped) return

    this.events.emit('opencore:vehicle:warpInto', clientId, request.networkId, request.seatIndex)
  }
}
