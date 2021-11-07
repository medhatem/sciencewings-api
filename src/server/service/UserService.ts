import { CredentialsRO, UserRO, UserSignedInRO, UserSignedUpRO } from '../routes/UserRoutes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { BaseService } from './BaseService';
import { User } from '@models/User';
import { UserDao } from '../dao/UserDao';
import { userCredentialsSchema } from '../validators/userCredentials';
import { userValidationSchema } from '../validators/userValidator';
import { validate } from '../decorators/bodyValidationDecorators/validate';

@provideSingleton()
export class UserService extends BaseService<User> {
  constructor(public dao: UserDao) {
    super(dao);
  }

  static getInstance(): UserService {
    return container.get(UserService);
  }

  @validate(userValidationSchema)
  public async signup(user: UserRO): Promise<UserSignedUpRO> {
    const userSignedUpResult = await this.dao.signup(user);
    return new UserSignedUpRO(userSignedUpResult);
  }

  @validate(userCredentialsSchema)
  public async signin(credentials: CredentialsRO): Promise<UserSignedInRO> {
    const userSignedInResult = await this.dao.signin(credentials);
    return new UserSignedInRO(userSignedInResult);
  }
}
