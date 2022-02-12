import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { AddressDao } from '@modules/address/daos/AddressDAO';
import { AddressOrganizationDTO } from '@modules/address/dtos/AddressDTO';
import { Address } from '@modules/address/models/AdressModel';
import { IAddressService } from '../interfaces/IAddressService';

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

  @log()
  @safeGuard()
  async deleteAddress(payload: Address): Promise<Result<number>> {
    await this.dao.remove(payload);
    return Result.ok<number>(payload.id);
  }
}
