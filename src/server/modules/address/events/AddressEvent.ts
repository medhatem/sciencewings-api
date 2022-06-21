import { AddressService } from '@/modules/address/services/AddressService';
import { on } from '@/decorators/events';
import { AddressType } from '@/modules/address/models';
import { Organization } from '@/modules/organizations';

export class AddressEvent {
  @on('create-address')
  async createAddress(address: any, organization: Organization) {
    const addressService = AddressService.getInstance();
    await addressService.create({
      city: address.city,
      apartment: address.apartment,
      country: address.country,
      code: address.code,
      province: address.province,
      street: address.street,
      type: AddressType.ORGANIZATION,
      organization,
    });
  }
}
