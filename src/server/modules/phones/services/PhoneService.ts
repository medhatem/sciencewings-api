import { container, provideSingleton } from '@di/index';
import { BaseService } from '../../base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { Phone } from '../../phones/models/Phone';
import { PhoneDao } from '../../phones/daos/PhoneDAO';
import { PhoneDTO } from '../../phones/dtos/PhoneDTO';
import { Organization } from '../../organizations/models/Organization';
import { User } from '../../users/models/User';
import { IPhoneService } from '../interfaces/IPhoneService';

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
