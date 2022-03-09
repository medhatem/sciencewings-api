import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address/models/AdressModel';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '../interfaces/IAddressService';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

@provideSingleton(IAddressService)
export class AddressService extends BaseService<Address> implements IAddressService {
  constructor(public dao: AddressDao) {
    super(dao);
  }

  static getInstance(): IAddressService {
    return container.get(IAddressService);
  }

  /**
   * create an address in the database
   * @param payload address data
   * @returns created address
   */
  @log()
  @safeGuard()
  async createAddress(payload: AddressRO): Promise<Result<Address>> {
    const wrappedAddress = this.wrapEntity(this.dao.model, payload);
    const address: Address = await this.dao.create(wrappedAddress);
    return Result.ok<Address>(address);
  }
}
