import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from 'server/decorators/log';
import { safeGuard } from 'server/decorators/safeGuard';
import { UserPhoneDao } from '../daos/UserPhoneDAO';
import { UserPhone } from '../models/UserPhone';

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
  async createPhone(payload: UserPhone): Promise<Result<number>> {
    const phone = await this.dao.create(payload);
    return Result.ok<number>(phone.id);
  }
}
