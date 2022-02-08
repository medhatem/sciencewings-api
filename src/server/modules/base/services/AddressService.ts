import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { AddressDao } from '../daos/AddressDAO';
import { Address } from '../models/AdressModel';

@provideSingleton()
export class AddressService extends BaseService<Address> {
  constructor(public dao: AddressDao) {
    super(dao);
  }

  static getInstance(): AddressService {
    return container.get(AddressService);
  }

  @log()
  @safeGuard()
  async createAddress(payload: Address): Promise<Result<number>> {
    const phone = await this.dao.create(payload);
    return Result.ok<number>(phone.id);
  }

  @log()
  @safeGuard()
  async createBulkAddress(payload: Address[]): Promise<Result<number>> {
    payload.map((el: Address) => {
      this.dao.repository.persist(el);
    });
    this.dao.repository.flush();
    return Result.ok<number>(200);
  }
}
