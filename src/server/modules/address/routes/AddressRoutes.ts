import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Path } from 'typescript-rest';
import { Address } from '@/modules/address/models/Address';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { AddressBaseDTO, UpdatedAddressDTO } from '@/modules/address/dtos/AddressDTO';

@provideSingleton()
@Path('address')
export class AddressRoutes extends BaseRoutes<Address> {
  constructor(AddressService: IAddressService) {
    super(AddressService as any, new AddressBaseDTO(), new UpdatedAddressDTO());
  }

  static getInstance(): AddressRoutes {
    return container.get(AddressRoutes);
  }
}
