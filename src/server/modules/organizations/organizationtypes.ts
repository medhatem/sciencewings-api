import { timeDisplayMode, weekDay } from './models/OrganizationSettings';

export type localisationSettingsType = {
  addressId: number;
  apartment: string;
  street: string;
  city: string;
  country: string;
  province: string;
  code: string;
  firstDayOfWeek: weekDay;
  timeDisplayMode: timeDisplayMode;
};
