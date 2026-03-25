import { inject, injectable } from 'tsyringe'
import { IClientRuntimeBridge } from '@open-core/framework/client'
import { IClientWebViewBridge } from '@open-core/framework/contracts/client'
import type {
  WebViewCapabilities,
  WebViewDefinition,
  WebViewFocusOptions,
  WebViewMessage,
} from '@open-core/framework/contracts/client'

const FIVEM_WEBVIEW_CAPABILITIES: WebViewCapabilities = {
  supportsFocus: true,
  supportsCursor: true,
  supportsInputPassthrough: true,
  supportsBidirectionalMessaging: true,
  supportsExecute: false,
  supportsHeadless: false,
  supportsChatMode: false,
}

@injectable()
export class FiveMClientWebViewBridge extends IClientWebViewBridge {
  private readonly views = new Map<string, WebViewDefinition>()
  private readonly handlers = new Set<(message: WebViewMessage) => void | Promise<void>>()
  private callbacksRegistered = false

  constructor(@inject(IClientRuntimeBridge as any) private readonly runtime: IClientRuntimeBridge) {
    super()
  }

  getCapabilities(): WebViewCapabilities {
    return FIVEM_WEBVIEW_CAPABILITIES
  }

  create(definition: WebViewDefinition): void {
    this.views.set(definition.id, definition)
    this.ensureCallbacksRegistered()
    this.sendSystem('create', definition.id, definition)
    if (definition.visible) this.show(definition.id)
    if (definition.focused) {
      this.focus(definition.id, {
        cursor: definition.cursor,
        inputPassthrough: definition.inputPassthrough,
      })
    }
  }

  destroy(viewId: string): void {
    if (!this.views.has(viewId)) return
    this.sendSystem('destroy', viewId)
    this.views.delete(viewId)
  }

  exists(viewId: string): boolean {
    return this.views.has(viewId)
  }
  show(viewId: string): void {
    this.sendSystem('show', viewId)
  }
  hide(viewId: string): void {
    this.sendSystem('hide', viewId)
  }
  focus(_viewId: string, options: WebViewFocusOptions = {}): void {
    this.runtime.setWebViewFocus(true, options.cursor ?? true)
    this.runtime.setWebViewInputPassthrough(options.inputPassthrough ?? false)
  }
  blur(_viewId: string): void {
    this.runtime.setWebViewInputPassthrough(false)
    this.runtime.setWebViewFocus(false, false)
  }
  markAsChat(_viewId: string): void {}
  send(viewId: string, event: string, payload: unknown): void {
    this.runtime.sendWebViewMessage(
      JSON.stringify({
        __opencoreWebView: true,
        viewId,
        action: event,
        data: payload,
      }),
    )
  }

  onMessage(handler: (message: WebViewMessage) => void | Promise<void>): () => void {
    this.ensureCallbacksRegistered()
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  private ensureCallbacksRegistered(): void {
    if (this.callbacksRegistered) return
    this.callbacksRegistered = true
    this.runtime.registerWebViewCallback(
      '__opencore:webview:message',
      async (data: unknown, cb) => {
        const message = data as WebViewMessage
        for (const handler of this.handlers) {
          await handler(message)
        }
        cb({ ok: true })
      },
    )
  }

  private sendSystem(type: string, viewId: string, payload?: unknown): void {
    this.runtime.sendWebViewMessage(
      JSON.stringify({
        __opencoreWebView: true,
        type,
        viewId,
        payload,
      }),
    )
  }
}
