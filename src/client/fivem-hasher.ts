import { injectable } from 'tsyringe'
import { IHasher } from '@open-core/framework/contracts'

@injectable()
export class FiveMClientHasher extends IHasher {
  getHashKey(str: string): number {
    return GetHashKey(str)
  }
}
