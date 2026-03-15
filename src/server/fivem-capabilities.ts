import { IdentifierTypes } from '@open-core/framework/contracts'
import { IPlatformContext } from '@open-core/framework/contracts/server'
import { injectable } from 'tsyringe'

/**
 * FiveM platform context implementation.
 */
@injectable()
export class FiveMPlatformContext extends IPlatformContext {
  readonly platformName = 'fivem'
  readonly displayName = 'FiveM'

  readonly identifierTypes = [
    IdentifierTypes.STEAM,
    IdentifierTypes.LICENSE,
    IdentifierTypes.LICENSE2,
    IdentifierTypes.DISCORD,
    IdentifierTypes.FIVEM,
    IdentifierTypes.XBL,
    IdentifierTypes.LIVE,
    IdentifierTypes.IP,
  ] as const

  readonly maxPlayers = 1024
  readonly gameProfile = 'gta5'
  readonly defaultSpawnModel = 'mp_m_freemode_01'
  readonly defaultVehicleType = 'automobile'
  readonly enableServerVehicleCreation = true
}
