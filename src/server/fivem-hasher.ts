import { injectable } from 'tsyringe'
import { IHasher } from '@open-core/framework'

/**
 * FiveM implementation of hash utilities.
 */
@injectable()
export class FiveMHasher extends IHasher {
  getHashKey(str: string): number {
    return GetHashKey(str)
  }
}
