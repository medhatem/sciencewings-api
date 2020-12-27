import * as mongoose from 'mongoose';

import { container, provideSingleton } from '../di';

import { BaseModel } from './BaseModel';
import { IUser } from '../interface';

@provideSingleton()
export class User extends BaseModel<IUser> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }

  public initProperties(): mongoose.Schema<IUser> {
    return new mongoose.Schema<IUser>({
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      address: {
        appt: Number,
        zip: String,
        city: String,
        street: String,
      },
    });
  }
}
