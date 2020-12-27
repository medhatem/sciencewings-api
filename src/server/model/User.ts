import * as mongoose from 'mongoose';

import { IAddress, IUser, IUserProfessionalMetadata } from '../interface';
import { container, provideSingleton } from '../di';

import { BaseModel } from './BaseModel';

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
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true, index: true },
      password: { type: String, required: true },
      address: {
        required: false,
        type: new mongoose.Schema<IAddress>({
          appt: { type: Number },
          zip: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
          street: {
            type: String,
            required: true,
          },
        }),
      },
      professional: {
        required: false,
        type: new mongoose.Schema<IUserProfessionalMetadata>({
          isProfessional: {
            type: Boolean,
            required: true,
          },
          job: {
            type: String,
            required: function () {
              // job is required only when isProfessionnal is true
              return !!this.isProfessional;
            },
          },
        }),
      },
    });
  }
}
