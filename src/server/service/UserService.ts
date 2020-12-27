import * as mongoose from 'mongoose';

import { container, provideSingleton } from '../di';

import { IUser } from '../interface';
import { UserDao } from '../dao/UserDao';

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
  public async create(user: IUser): Promise<mongoose.Types.ObjectId> {
    const createdUser = await this.dao.create(user);
    return createdUser;
  }
}
