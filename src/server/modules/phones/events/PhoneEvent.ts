import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations';
import { PhoneService } from '../services';

export class PhoneEvent {
  @on('create-phone')
  async createPhone(phone: any, organization: Organization) {
    const addressService = PhoneService.getInstance();
    await addressService.create({
      phoneLabel: phone.phoneLabel,
      phoneCode: phone.phoneCode,
      phoneNumber: phone.phoneNumber,
      organization,
    });
  }
}
