import * as mongoose from 'mongoose';

export interface IBase extends mongoose.Document {
  createdAt: Number;
  updatedAt: Number;
}
