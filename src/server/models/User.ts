import { container, provideSingleton } from '@di/index';

import { BaseModel } from './BaseModel';
import { prop } from '@typegoose/typegoose';

export enum ProfessionalJobs {
  'BARBER' = 'barber',
  'CAR_MECHANIC' = 'car_mechanic',
}
export class Professional {
  @prop({ required: true })
  isProfessional: boolean;

  @prop({ enum: ProfessionalJobs })
  job?: ProfessionalJobs;
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
export class User extends BaseModel<User> {
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
  address: Address;

  @prop({
    type: () => Professional,
    _id: false,
  })
  professional?: Professional;
}
