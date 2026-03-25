import { IExports } from '@open-core/framework/contracts/server'

export class FiveMExports extends IExports {
  register(exportName: string, handler: (...args: unknown[]) => unknown): void {
    exports(exportName, handler)
  }

  getResource<T = unknown>(resourceName: string): T | undefined {
    return exports[resourceName] as unknown as T | undefined
  }
}
