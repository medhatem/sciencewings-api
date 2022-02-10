import { Result } from '@utils/Result';
import { AddressOrganizationDTO } from '../dtos/AddressDTO';
import { Address } from '../models/AdressModel';

export abstract class IAddressService {
  createAddress: (payload: Address) => Promise<Result<number>>;
  createBulkAddress: (payload: AddressOrganizationDTO[]) => Promise<Result<number>>;
}
