import { Address } from '../models/AdressModel';
import { AddressOrganizationDTO } from '../dtos/AddressDTO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: Address) => Promise<Result<Address>>;
  createBulkAddress: (payload: AddressOrganizationDTO[]) => Promise<Result<number>>;
}
