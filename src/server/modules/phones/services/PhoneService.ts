import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { User } from '@/modules/users/models/User';
import { log } from '@/decorators/log';

@provideSingleton(IPhoneService)
export class PhoneService extends BaseService<Phone> implements IPhoneService {
  constructor(public dao: PhoneDao) {
    super(dao);
  }

  static getInstance(): IPhoneService {
    return container.get(IPhoneService);
  }

  private extractFromRO(payload: PhoneRO): Partial<Phone> {
    return {
      phoneLabel: payload.phoneLabel,
      phoneCode: payload.phoneCode,
      phoneNumber: payload.phoneNumber,
    };
  }

  @log()
  async createBulkPhoneForUser(payload: PhoneRO[], entity: User): Promise<void> {
    if (payload) {
      const phones = await Promise.all(
        payload.map(async (phone) => {
          const wrappedPhone = this.wrapEntity(Phone.getInstance(), this.extractFromRO(phone));
          wrappedPhone.user = entity as User;
          return wrappedPhone;
        }),
      );

      this.dao.repository.persist(phones);
    }
  }

  @log()
  async createBulkPhoneForOrganization(payload: PhoneRO[], entity: Organization): Promise<void> {
    if (payload) {
      const phones = await Promise.all(
        payload.map(async (phone) => {
          const wrappedPhone = this.wrapEntity(this.dao.model, this.extractFromRO(phone));
          wrappedPhone.organization = entity as Organization;
          return wrappedPhone;
        }),
      );

      this.dao.repository.persist(phones);
    }
  }
}
