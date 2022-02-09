import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { UserPhone } from '../models/UserPhone';
import { UserPhoneDao } from '../daos/UserPhoneDAO';
import { UserPhoneRO } from '../routes/RequstObjects';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';

@provideSingleton()
export class PhoneService extends BaseService<UserPhone> {
  constructor(public dao: UserPhoneDao) {
    super(dao);
  }

  static getInstance(): PhoneService {
    return container.get(PhoneService);
  }

  @log()
  @safeGuard()
  async createPhone(payload: UserPhoneRO): Promise<Result<number>> {
    const entity = this.wrapEntity(this.dao.model, payload);

    const phone = await this.dao.create(entity);
    return Result.ok<number>(phone.id);
  }
}
