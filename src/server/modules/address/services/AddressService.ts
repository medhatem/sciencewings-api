import { container, provideSingleton } from '@di/index';

import { Address } from '@/modules/address/models/AdressModel';
import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '../interfaces/IAddressService';
import { Result } from '@utils/Result';
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

  @log()
  @safeGuard()
  async createAddress(payload: AddressDTO): Promise<Result<Address>> {
    const wrappedAddress = this.wrapEntity(this.dao.model, payload);
    const address = await this.dao.create(wrappedAddress);
    return Result.ok<Address>(address);
  }

  @log()
  @safeGuard()
  async createBulkAddress(payload: AddressDTO[]): Promise<Result<number>> {
    payload.map((el: AddressDTO) => {
      const address = this.wrapEntity(this.dao.model, el);
      this.dao.repository.persist(address);
    });

    return Result.ok<number>(200);
  }
}
