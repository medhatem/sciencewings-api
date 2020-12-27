import * as mongoose from 'mongoose';

export interface IAddress extends mongoose.Document {
  appt: number;
  city: string;
  street: string;
  zip: string;
}
