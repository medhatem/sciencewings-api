import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { Address } from '../models/AdressModel';
import { AddressRO } from '../routes/AddressRO';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressRO) => Promise<Result<Address>>;
  createBulkAddress: (payload: AddressRO[]) => Promise<Result<number>>;
}
