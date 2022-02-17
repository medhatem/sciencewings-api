import { Address } from '../models/AdressModel';
import { AddressDTO } from '../dtos/AddressDTO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressDTO) => Promise<Result<Address>>;
  createBulkAddress: (payload: AddressDTO[]) => Promise<Result<number>>;
}
