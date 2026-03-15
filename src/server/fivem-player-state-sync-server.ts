import { inject, injectable } from 'tsyringe'
import { IEntityServer, IPlayerServer, IPlayerStateSyncServer } from '@open-core/framework/contracts/server'

@injectable()
export class FiveMPlayerStateSyncServer extends IPlayerStateSyncServer {
  constructor(
    @inject(IPlayerServer as any) private readonly playerServer: IPlayerServer,
    @inject(IEntityServer as any) private readonly entityServer: IEntityServer,
  ) {
    super()
  }

  getHealth(playerSrc: string): number {
    return this.entityServer.getHealth(this.playerServer.getPed(playerSrc))
  }

  setHealth(playerSrc: string, health: number): void {
    const ped = this.playerServer.getPed(playerSrc)
    this.entityServer.setHealth(ped, health)
    this.entityServer.getStateBag(ped).set('health', health, true)
  }

  getArmor(playerSrc: string): number {
    return this.entityServer.getArmor(this.playerServer.getPed(playerSrc))
  }

  setArmor(playerSrc: string, armor: number): void {
    const ped = this.playerServer.getPed(playerSrc)
    this.entityServer.setArmor(ped, armor)
    this.entityServer.getStateBag(ped).set('armor', armor, true)
  }
}
