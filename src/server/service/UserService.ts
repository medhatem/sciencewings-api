import { Credentials, UserDao } from '../dao/UserDao';
import { container, provideSingleton } from '../di';

import { IUser } from '../interface';
import { userCredentialsSchema } from '../validators/userCredentials';
import { userValidationSchema } from '../validators/userValidator';
import { validate } from '../decorators/bodyValidationDecorators/validate';

@provideSingleton()
export class UserService {
  constructor(protected dao: UserDao) {}

  static getInstance(): UserService {
    return container.get(UserService);
  }

  public async get(id: string): Promise<IUser> {
    const user = await this.dao.get(id);
    return user;
  }

  @validate(userValidationSchema)
  public async create(user: IUser): Promise<{ [key: string]: any }> {
    const createdUser = await this.dao.create(user);
    return createdUser;
  }

  @validate(userCredentialsSchema)
  public async signin(credentials: Credentials): Promise<{ token: string; user: IUser }> {
    return await this.dao.signin(credentials);
  }
}
