import { container, provideSingleton } from '@di/index';

import { Address } from '../../address/models/AdressModel';
import { AddressDao } from '../../address/daos/AddressDAO';
import { AddressOrganizationDTO } from '../../address/dtos/AddressDTO';
import { BaseService } from '../../base/services/BaseService';
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
  async createAddress(payload: Address): Promise<Result<Address>> {
    const address = await this.dao.create(payload);
    return Result.ok<Address>(address);
  }

  @log()
  @safeGuard()
  async createBulkAddress(payload: AddressOrganizationDTO[]): Promise<Result<number>> {
    payload.map((el: AddressOrganizationDTO) => {
      const address = this.wrapEntity(this.dao.model, el);
      this.dao.repository.persist(address);
    });

    return Result.ok<number>(200);
  }
}
