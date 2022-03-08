import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address/models/AdressModel';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '../interfaces/IAddressService';
import { Organization } from '@/modules/organizations';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users';
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
  async createAddress(payload: AddressRO): Promise<Result<Address>> {
    const wrappedAddress = this.wrapEntity(this.dao.model, payload);
    const address: Address = await this.dao.create(wrappedAddress);
    return Result.ok<Address>(address);
  }

  /**
   * persiste an address for a given user
   * you need to flush them later
   * @param payload an array of address
   * @param user
   * @returns
   */
  @log()
  @safeGuard()
  async createBulkAddressForUser(payload: AddressRO[], user: User): Promise<Result<number>> {
    const address = payload.map((el: AddressRO) => {
      const address: Address = this.wrapEntity(this.dao.model, el);
      address.user = user as User;
      return address;
    });
    this.dao.repository.persist(address);
    return Result.ok<number>(200);
  }

  /**
   * persiste an address for a given organization
   * you need to flush them later
   * @param payload an array of address
   * @param organization
   * @returns
   */
  @log()
  @safeGuard()
  async createBulkAddressForOrganization(payload: AddressRO[], organization: Organization): Promise<Result<number>> {
    const address = payload.map((el: AddressRO) => {
      const address: Address = this.wrapEntity(this.dao.model, el);
      address.organization = organization as Organization;
      return address;
    });
    this.dao.repository.persist(address);
    return Result.ok<number>(200);
  }
}
