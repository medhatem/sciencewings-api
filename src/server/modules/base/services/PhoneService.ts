import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { Phone } from '../models/Phone';
import { PhoneDao } from '../daos/PhoneDAO';
import { PhoneRO } from '../dtos/PhoneDTO';
import { Organization } from '@modules/organizations/models/Organization';
import { User } from '@modules/users/models/User';

type EntityType = User | Organization;

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
  async createPhone(payload: PhoneRO): Promise<Result<number>> {
    const entity = this.wrapEntity(this.dao.model, payload);

    const phone = await this.dao.create(entity);
    return Result.ok<number>(phone.id);
  }

  @log()
  @safeGuard()
  async createBulkPhone(payload: PhoneRO[], entityModel: string, entity: EntityType): Promise<Result<number>> {
    await Promise.all(
      payload.map(async (phone) => {
        const wrappedPhone = this.wrapEntity(this.dao.model, phone);

        if (entityModel === 'User') wrappedPhone.user = entity as User;
        else if (entityModel === 'Organization') wrappedPhone.organization = entity as Organization;

        console.log({ wrappedPhone });

        this.dao.repository.persist(wrappedPhone);
      }),
    );

    return Result.ok<number>(200);
  }
}
