import { Prop, prop } from '@typegoose/typegoose';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@models/BaseModel';
import { Days } from '../interface';
import { User } from '@models/User';

export class WorkingDay {
  @prop({ enum: Days })
  day: Days;
  @prop()
  from: Date;
  @prop()
  to: Date;
}

@provideSingleton()
export class Barber extends BaseModel<Barber> {
  constructor() {
    super();
  }

  static getInstance(): Barber {
    return container.get(Barber);
  }

  @prop({ ref: () => User })
  userId: string;

  @prop({ default: 0 })
  ratings?: number;

  @prop({ default: [] })
  diplomas?: string[] = [];

  @prop() // should reference a store
  storeId?: string = null;

  @prop({})
  schedule?: number[][] = [];

  @prop({ type: WorkingDay, default: [] })
  workingDays?: WorkingDay[] = [];

  @Prop({})
  timezone?: string;
}
