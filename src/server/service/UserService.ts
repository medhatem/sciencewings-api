import { Credentials, UserDao } from '../dao/UserDao';
import { container, provideSingleton } from '../di';

import { BaseService } from './BaseService';
import { IUser } from '../interface';
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
  public async signup(user: IUser): Promise<{ [key: string]: any }> {
    return await this.dao.signup(user);
  }

  @validate(userCredentialsSchema)
  public async signin(credentials: Credentials): Promise<{ token: string; user: IUser }> {
    return await this.dao.signin(credentials);
  }
}
