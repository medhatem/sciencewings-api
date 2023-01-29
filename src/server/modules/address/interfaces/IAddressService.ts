import { Address } from '@/modules/address/models/Address';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IAddressService extends IBaseService<any> {
  createAddress: (payload: AddressRO) => Promise<Address>;
}
