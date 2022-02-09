import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { Phone } from '../models/Phone';
import { PhoneDao } from '../daos/PhoneDAO';
import { PhoneDTO } from '../dtos/PhoneDTO';
import { Organization } from '@modules/organizations/models/Organization';
import { User } from '@modules/users/models/User';

@provideSingleton()
export class PhoneService extends BaseService<Phone> {
  constructor(public dao: PhoneDao) {
    super(dao);
  }

  static getInstance(): PhoneService {
    return container.get(PhoneService);
  }

  @log()
  @safeGuard()
  async createPhone(payload: PhoneDTO): Promise<Result<number>> {
    const entity = this.wrapEntity(this.dao.model, payload);

    const phone = await this.dao.create(entity);
    return Result.ok<number>(phone.id);
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
