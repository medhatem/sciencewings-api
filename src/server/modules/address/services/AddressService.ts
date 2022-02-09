import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { AddressDao } from '@modules/address/daos/AddressDAO';
import { AddressOrganizationDTO } from '@modules/address/dtos/AddressDTO';
import { Address } from '@modules/address/models/AdressModel';

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
  async createBulkAddress(payload: AddressOrganizationDTO[]): Promise<Result<number>> {
    payload.map((el: AddressOrganizationDTO) => {
      const address = this.wrapEntity(this.dao.model, el);
      this.dao.repository.persist(address);
    });

    return Result.ok<number>(200);
  }
}
