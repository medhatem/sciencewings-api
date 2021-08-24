import { CredentialsRO, UserRO, UserSignedInRO, UserSignedUpRO } from '../routes/UserRoutes/RequestObject';
import { container, provideSingleton } from '../di';

import { BaseService } from './BaseService';
import { IUser } from '../interface';
import { UserDao } from '../dao/UserDao';
import { userCredentialsSchema } from '../validators/userCredentials';
import { userValidationSchema } from '../validators/userValidator';
import { validate } from '../decorators/bodyValidationDecorators/validate';

@provideSingleton()
export class UserService extends BaseService<IUser> {
  constructor(public dao: UserDao) {
    super(dao);
  }

  static getInstance(): UserService {
    return container.get(UserService);
  }

  @validate(userValidationSchema)
  public async signup(user: UserRO): Promise<UserSignedUpRO> {
    return await this.dao.signup(user);
  }

  @validate(userCredentialsSchema)
  public async signin(credentials: CredentialsRO): Promise<UserSignedInRO> {
    return await this.dao.signin(credentials);
  }
}
