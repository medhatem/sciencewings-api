import * as mongoose from 'mongoose';

export interface IUserProfessionalMetadata extends mongoose.Document {
  isProfessional: boolean;
  job: string;
}
