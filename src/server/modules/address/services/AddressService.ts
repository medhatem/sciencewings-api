import { container, provideSingleton } from '@di/index';
import { BaseService } from '../../base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { AddressDao } from '../../address/daos/AddressDAO';
import { Address } from '../../address/models/AdressModel';
import { IAddressService } from '../interfaces/IAddressService';
import { AddressRO } from '../routes/AddressRO';

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
  async createAddress(payload: AddressRO): Promise<Result<Address>> {
    const address = await this.dao.create(this.wrapEntity(this.dao.model, payload));
    return Result.ok<Address>(address);
  }

  @log()
  @safeGuard()
  async createBulkAddress(payload: AddressRO[]): Promise<Result<number>> {
    payload.map((el: AddressRO) => {
      const address = this.wrapEntity(this.dao.model, el);
      this.dao.repository.persist(address);
    });

    return Result.ok<number>(200);
  }
}
