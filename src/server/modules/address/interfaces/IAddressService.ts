import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { AddressDTO } from '../dtos/AddressDTO';
import { Address } from '../models/AdressModel';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressDTO) => Promise<Result<Address>>;
  createBulkAddress: (payload: AddressDTO[]) => Promise<Result<number>>;
}
