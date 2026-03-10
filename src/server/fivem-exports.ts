import { IExports } from '@open-core/framework'

export class FiveMExports extends IExports {
  register(exportName: string, handler: (...args: any[]) => any): void {
    exports(exportName, handler)
  }

  getResource<T = any>(resourceName: string): T | undefined {
    return (globalThis as any).exports?.[resourceName] as T | undefined
  }
}
