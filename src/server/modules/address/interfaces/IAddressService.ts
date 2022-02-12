import { IBaseService } from '@modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { AddressOrganizationDTO } from '../dtos/AddressDTO';
import { Address } from '../models/AdressModel';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: Address) => Promise<Result<Address>>;
  createBulkAddress: (payload: AddressOrganizationDTO[]) => Promise<Result<number>>;
}
