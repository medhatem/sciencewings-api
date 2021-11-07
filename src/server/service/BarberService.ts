import { UserRO, UserSignedUpRO } from '@routes/UserRoutes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { Barber } from '@models/Barber';
import { BarberDao } from '../dao/BarberDao';
import { BaseService } from './BaseService';
import { UserService } from './UserService';

@provideSingleton()
export class BarberService extends BaseService<Barber> {
  constructor(public dao: BarberDao, public userService: UserService) {
    super(dao);
  }

  static getInstance(): BarberService {
    return container.get(BarberService);
  }

  public async signup(barber: UserRO): Promise<UserSignedUpRO> {
    const { id, token } = await this.userService.signup(barber);
    try {
      await this.dao.create({
        userId: id,
      } as any);
      return new UserSignedUpRO({ token, id });
    } catch (e) {
      console.log(`could not create Barber with userId ${id} `);
      return new UserSignedUpRO({});
    }
  }
}
