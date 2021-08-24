import { IAddress, IUser, IUserProfessionalMetadata } from '../interface';
import { container, provideSingleton } from '../di';

import { BaseModel } from './BaseModel';
import { prop } from '@typegoose/typegoose';

export class Professional {
  @prop({ required: true })
  isProfessional: boolean;

  @prop()
  job?: string;
}

export class Address {
  @prop({ required: true })
  zip: string;

  @prop({ required: true })
  city: string;

  @prop({ required: true })
  street: string;

  @prop()
  appt?: string;
}

@provideSingleton()
export class User extends BaseModel<IUser> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }

  @prop()
  firstName: string;
  @prop()
  lastName: string;

  @prop({ required: true, unique: true, index: true })
  email: string;
  @prop({ required: true })
  password: string;
  @prop({ type: () => Address, required: true, _id: false })
  address: IAddress;

  @prop({
    type: () => Professional,
    _id: false,
  })
  professional?: IUserProfessionalMetadata;
}
