import { Result } from '@utils/Result';
import { AddressOrganizationDTO } from '../dtos/AddressDTO';
import { Address } from '../models/AdressModel';
import { AddressService } from '../services/AddressService';

export abstract class IAddressService {
  getInstance: () => AddressService;
  createAddress: (payload: Address) => Promise<Result<number>>;
  createBulkAddress: (payload: AddressOrganizationDTO[]) => Promise<Result<number>>;
}
