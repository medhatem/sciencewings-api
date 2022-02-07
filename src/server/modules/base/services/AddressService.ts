import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from 'server/decorators/log';
import { safeGuard } from 'server/decorators/safeGuard';
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
}
