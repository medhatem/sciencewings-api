import { IBase } from './IBase';
import { IWorkingDays } from './IWorkingDays';

export interface IBarber extends IBase {
  userId: string;
  ratings: number;
  diplomas: string[];
  storeId: string;
  schedule: number[][];
  timezone: string;
  workingDays: IWorkingDays;
}
