import * as mongoose from 'mongoose';

import { container, provideSingleton } from '../di';

import { IUser } from '../interface';
import { User } from '../model/User';

@provideSingleton()
export class UserDao {
  private constructor(protected model: User) {
    model.generateModel();
  }

  static getInstance(): UserDao {
    return container.get(UserDao);
  }

  public async get(id: string): Promise<IUser> {
    const user = (await this.model.modelClass.findById(id).exec()) as IUser;
    return user;
  }

  public async create(user: IUser): Promise<mongoose.Types.ObjectId> {
    const createdUser = (await this.model.modelClass.create(user)) as IUser;
    console.log('created user is ', createdUser);
    return user._id;
  }

  //   public update(user: User): User {}

  //   public delete(id: string): void {}
}
