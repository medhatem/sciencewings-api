import { Address } from '@/modules/address/models/Address';
import { OrganizationSettings } from '@/modules/organizations/models/OrganizationSettings';

export type localisationSettingsType = {
  localisationDataFromOrgAdress: Address;
  localisationDataFromOrgSettings: OrganizationSettings;
};
