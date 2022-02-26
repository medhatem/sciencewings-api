import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models/User';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';

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
      label: payload.label,
      code: payload.code,
      number: payload.number,
    };
  }

  @log()
  @safeGuard()
  async createBulkPhoneForUser(payload: PhoneRO[], entity: User): Promise<Result<number>> {
    const phones = await Promise.all(
      payload.map(async (phone) => {
        const wrappedPhone = this.wrapEntity(this.dao.model, this.extractFromRO(phone));
        wrappedPhone.user = entity as User;
      }),
    );

    this.dao.repository.persist(phones);
    return Result.ok<number>(200);
  }

  @log()
  @safeGuard()
  async createBulkPhoneForOrganization(payload: PhoneRO[], entity: Organization): Promise<Result<number>> {
    const phones = await Promise.all(
      payload.map(async (phone) => {
        const wrappedPhone = this.wrapEntity(this.dao.model, this.extractFromRO(phone));
        wrappedPhone.organization = entity as Organization;
        return wrappedPhone;
      }),
    );

    this.dao.repository.persist(phones);
    return Result.ok<number>(200);
  }

  @log()
  @safeGuard()
  async createPhoneForMember(payload: PhoneRO, entity: Member): Promise<Result<Phone>> {
    const phone = this.wrapEntity(this.dao.model, this.extractFromRO(payload));
    phone.member = entity as Member;
    this.dao.repository.persist(phone);
    return Result.ok<Phone>(phone);
  }
}
