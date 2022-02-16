import { container, provideSingleton } from '@di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IPhoneService } from '../interfaces/IPhoneService';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { Result } from '@utils/Result';
import { User } from '@/modules/users/models/User';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

@provideSingleton(IPhoneService)
export class PhoneService extends BaseService<Phone> implements IPhoneService {
  constructor(public dao: PhoneDao) {
    super(dao);
  }

  static getInstance(): IPhoneService {
    return container.get(IPhoneService);
  }

  @log()
  @safeGuard()
  async createPhone(payload: PhoneDTO): Promise<Result<Phone>> {
    const entity = this.wrapEntity(this.dao.model, payload);
    const phone = await this.dao.create(entity);
    return Result.ok<Phone>(phone);
  }

  @log()
  @safeGuard()
  async createBulkPhoneForUser(payload: PhoneDTO[], entity: User): Promise<Result<number>> {
    const phones = await Promise.all(
      payload.map(async (phone) => {
        const wrappedPhone = this.wrapEntity(this.dao.model, phone);
        wrappedPhone.user = entity as User;
      }),
    );

    this.dao.repository.persist(phones);
    return Result.ok<number>(200);
  }

  @log()
  @safeGuard()
  async createBulkPhoneForOrganization(payload: PhoneDTO[], entity: Organization): Promise<Result<number>> {
    const phones = await Promise.all(
      payload.map(async (phone) => {
        const wrappedPhone = this.wrapEntity(this.dao.model, phone);
        wrappedPhone.organization = entity as Organization;
        return wrappedPhone;
      }),
    );

    this.dao.repository.persist(phones);
    return Result.ok<number>(200);
  }
}
