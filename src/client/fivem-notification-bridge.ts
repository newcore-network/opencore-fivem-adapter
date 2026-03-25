import { injectable } from 'tsyringe'
import {
  IClientNotificationBridge,
  type ClientNotificationDefinition,
} from '@open-core/framework/contracts/client'

const ICON_MAP: Record<NonNullable<ClientNotificationDefinition['type']>, number> = {
  info: 1,
  success: 2,
  warning: 3,
  error: 4,
}

@injectable()
export class FiveMClientNotificationBridge extends IClientNotificationBridge {
  show(definition: ClientNotificationDefinition): void {
    switch (definition.kind) {
      case 'feed':
        SetNotificationTextEntry('STRING')
        AddTextComponentString(definition.message)
        DrawNotification(definition.blink ?? false, definition.saveToBrief ?? true)
        return
      case 'typed':
        BeginTextCommandThefeedPost('STRING')
        AddTextComponentString(definition.message)
        EndTextCommandThefeedPostMessagetext(
          'CHAR_SOCIAL_CLUB',
          'CHAR_SOCIAL_CLUB',
          true,
          ICON_MAP[definition.type ?? 'info'],
          '',
          definition.message,
        )
        return
      case 'advanced':
        SetNotificationTextEntry('STRING')
        AddTextComponentString(definition.message)
        if (definition.backgroundColor !== undefined) {
          SetNotificationBackgroundColor(definition.backgroundColor)
        }
        SetNotificationMessage(
          'CHAR_HUMANDEFAULT',
          'CHAR_HUMANDEFAULT',
          definition.flash ?? false,
          ICON_MAP[definition.type ?? 'info'],
          definition.title ?? '',
          definition.subtitle ?? '',
        )
        DrawNotification(definition.flash ?? false, definition.saveToBrief ?? true)
        return
      case 'help':
        BeginTextCommandDisplayHelp('STRING')
        AddTextComponentSubstringPlayerName(definition.message)
        EndTextCommandDisplayHelp(
          0,
          definition.looped ?? false,
          definition.beep ?? true,
          definition.duration ?? 5000,
        )
        return
      case 'subtitle':
        BeginTextCommandPrint('STRING')
        AddTextComponentSubstringPlayerName(definition.message)
        EndTextCommandPrint(definition.duration ?? 2500, true)
        return
      case 'floating':
        if (!definition.worldPosition) return
        SetFloatingHelpTextWorldPosition(
          1,
          definition.worldPosition.x,
          definition.worldPosition.y,
          definition.worldPosition.z,
        )
        SetFloatingHelpTextStyle(1, 1, 2, -1, 3, 0)
        BeginTextCommandDisplayHelp('STRING')
        AddTextComponentSubstringPlayerName(definition.message)
        EndTextCommandDisplayHelp(2, false, false, -1)
        return
    }
  }

  clear(scope?: 'help' | 'subtitle' | 'all'): void {
    if (!scope || scope === 'all' || scope === 'help') {
      ClearAllHelpMessages()
    }
    if (!scope || scope === 'all' || scope === 'subtitle') {
      ClearPrints()
    }
  }
}
