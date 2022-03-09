import { Address } from '@/modules/address/models/AdressModel';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressRO) => Promise<Result<Address>>;
}
