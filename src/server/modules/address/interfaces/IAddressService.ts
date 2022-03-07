import { Address } from '@/modules/address/models/AdressModel';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Organization } from '@/modules/organizations/models/Organization';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressRO) => Promise<Result<Address>>;
  createBulkAddressForUser: (payload: AddressRO[], user: User) => Promise<Result<number>>;
  createBulkAddressForOrganization: (payload: AddressRO[], organization: Organization) => Promise<Result<number>>;
}
