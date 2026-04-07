import { IExports } from '@open-core/framework/contracts/server'

type ExportArgs = readonly unknown[]

const REMOTE_EXPORTS_TIMEOUT_MS = 7500
const REMOTE_EXPORTS_INTERVAL_MS = 150

export class FiveMExports extends IExports {
  register(exportName: string, handler: (...args: unknown[]) => unknown): void {
    exports(exportName, handler)
  }

  /**
   * Resolves native FiveM resource exports directly.
   */
  getResource<T = unknown>(resourceName: string): T | undefined {
    return exports[resourceName] as unknown as T | undefined
  }

  /**
   * Returns an async proxy over native FiveM exports.
   *
   * @remarks
   * This helper is optional, but useful when you want a consistent async-only calling style
   * across adapters.
   */
  getRemoteResource<T = unknown>(resourceName: string): T {
    return new Proxy(
      {},
      {
        get: (_, exportName: string | symbol) => {
          if (
            typeof exportName !== 'string' ||
            exportName === 'then' ||
            exportName === 'catch' ||
            exportName === 'finally'
          ) {
            return undefined
          }

          return (...args: ExportArgs) => this.callRemoteExport(resourceName, exportName, ...args)
        },
      },
    ) as T
  }

  /**
   * Calls a native FiveM export and wraps the result in a promise for consistency.
   */
  async callRemoteExport<TResult = unknown>(
    resourceName: string,
    exportName: string,
    ...args: unknown[]
  ): Promise<TResult> {
    const resource =
      this.getResource<Record<string, (...callArgs: unknown[]) => unknown>>(resourceName)

    if (!resource) {
      throw new Error(`[exports] Resource "${resourceName}" exports not found.`)
    }

    const handler = resource[exportName]

    if (typeof handler !== 'function') {
      throw new Error(`[exports] Export "${exportName}" not found in resource "${resourceName}".`)
    }

    return Promise.resolve(handler(...args) as TResult)
  }

  /**
   * Waits until a FiveM resource exposes the requested export before returning the async proxy.
   */
  async waitForRemoteResource<T = unknown>(
    resourceName: string,
    options?: { exportName?: string; timeoutMs?: number; intervalMs?: number },
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs ?? REMOTE_EXPORTS_TIMEOUT_MS
    const intervalMs = options?.intervalMs ?? REMOTE_EXPORTS_INTERVAL_MS
    const startedAt = Date.now()

    while (Date.now() - startedAt < timeoutMs) {
      const resource = this.getResource<Record<string, unknown>>(resourceName)

      if (
        resource &&
        (!options?.exportName || typeof resource[options.exportName] === 'function')
      ) {
        return this.getRemoteResource<T>(resourceName)
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    throw new Error(`[exports] Timed out waiting for resource "${resourceName}" remote exports.`)
  }
}
