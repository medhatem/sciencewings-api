export enum Days {
  'MONDAY' = 'monday',
  'TUESDAY' = 'tuesday',
  'WEDNESDAY' = 'wednesday',
  'THURSDAY' = 'thursday',
  'FRIDAY' = 'friday',
  'SATURDAY' = 'saturday',
  'SUNDAY' = 'sunday',
}
export interface IWorkingDays {
  day: Days;
  from: Date;
  to: Date;
}
