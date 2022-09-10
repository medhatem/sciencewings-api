import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address/models/Address';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { log } from '@/decorators/log';

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
  async createAddress(payload: AddressRO): Promise<Address> {
    const wrappedAddress = this.wrapEntity(this.dao.model, payload);
    const address: Address = await this.dao.create(wrappedAddress);
    return address;
  }
}
