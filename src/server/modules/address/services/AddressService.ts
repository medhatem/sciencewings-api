import { container, provideSingleton } from '@di/index';

import { Address } from '../../address/models/AdressModel';
import { AddressDao } from '../../address/daos/AddressDAO';
import { AddressRO } from '../routes/AddressRO';
import { BaseService } from '../../base/services/BaseService';
import { IAddressService } from '../interfaces/IAddressService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';

@provideSingleton(IAddressService)
export class AddressService extends BaseService<Address> implements IAddressService {
  constructor(public dao: AddressDao) {
    super(dao);
  }

  static getInstance(): IAddressService {
    return container.get(IAddressService);
  }

  private extractFromRO(payload: AddressRO): Partial<Address> {
    return {
      country: payload.country,
      province: payload.province,
      code: payload.code,
      type: payload.type,
      city: payload.city,
      street: payload.street,
      appartement: payload.appartement,
    };
  }

  @log()
  @safeGuard()
  async createAddress(payload: AddressRO): Promise<Result<Address>> {
    const address = await this.dao.create(this.wrapEntity(this.dao.model, this.extractFromRO(payload)));
    return Result.ok<Address>(address);
  }

  @log()
  @safeGuard()
  async createBulkAddress(payload: AddressRO[]): Promise<Result<number>> {
    payload.map((el: AddressRO) => {
      const address = this.wrapEntity(this.dao.model, this.extractFromRO(el));
      this.dao.repository.persist(address);
    });

    return Result.ok<number>(200);
  }
}
