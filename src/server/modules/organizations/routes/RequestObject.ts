import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class ResourceManagerRO {
  @JsonProperty()
  organization: number;

  @JsonProperty()
  user: number;
}

@Serializable()
@unique
export class CreateOrganizationRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  email: string;

  @JsonProperty()
  phones: Array<PhoneRO>;

  @JsonProperty()
  type: string;

  @JsonProperty()
  addresses: Array<AddressRO>;

  @JsonProperty()
  labels: Array<string>;

  @JsonProperty()
  members: Array<number>;

  @JsonProperty()
  direction: number;

  @JsonProperty()
  socialFacebook?: string;
  @JsonProperty()
  socialTwitter?: string;
  @JsonProperty()
  socialGithub?: string;
  @JsonProperty()
  socialLinkedin?: string;
  @JsonProperty()
  socialYoutube?: string;
  @JsonProperty()
  socialInstagram?: string;

  @JsonProperty()
  adminContact: number;

  @JsonProperty()
  parentId?: string;
}

@Serializable()
@unique
export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}

// resource ROs

@Serializable()
@unique
export class ResourceTagRO {
  @JsonProperty()
  title!: string;
}

@Serializable()
@unique
export class ResourceCalendarRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  hoursPerDay?: number;

  @JsonProperty()
  timezone!: string;

  @JsonProperty()
  twoWeeksCalendar?: boolean;
}

@Serializable()
@unique
export class ResourceRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  resourceType!: string;

  @JsonProperty()
  user?: number;

  @JsonProperty()
  timezone!: string;

  @JsonProperty()
  calendar?: Array<ResourceCalendarRO>;

  @JsonProperty()
  tags?: Array<ResourceTagRO>;

  @JsonProperty()
  managers?: Array<ResourceManagerRO>;
}

@Serializable()
@unique
export class ResourceEventRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  dateFrom: Date;

  @JsonProperty()
  dateTo: Date;
}
//Resource settings
@Serializable()
@unique
export class ResourcesSettingsReservationGeneralRO {
  @JsonProperty()
  isEnabled?: boolean;
  @JsonProperty()
  isLoanable?: boolean;
  @JsonProperty()
  isReturnTheirOwnLoans?: boolean;
  @JsonProperty()
  isReservingLoansAtFutureDates?: boolean;
  @JsonProperty()
  fixedLoanDuration?: string;
  @JsonProperty()
  overdueNoticeDelay?: string;
  @JsonProperty()
  recurringReservations?: string;
}
@Serializable()
@unique
export class ResourceRateRO {
  @JsonProperty()
  description: string;

  @JsonProperty()
  rate: number;

  @JsonProperty()
  category: string;

  @JsonProperty()
  isPublic: boolean;

  @JsonProperty()
  isRequiredAccountNumber: boolean;

  @JsonProperty()
  duration: number;

  @JsonProperty()
  resource: number;
}

@Serializable()
@unique
export class ResourcesSettingsReservationUnitRO {
  @JsonProperty()
  unitName: string;
  @JsonProperty()
  unitLimit: string;
  @JsonProperty()
  unites: number;
}

@Serializable()
@unique
export class ResourceTimerRestrictionRO {
  @JsonProperty()
  isEditingWindowForUsers: boolean;
  @JsonProperty()
  isRestrictCreatingNewReservationBeforeTime: boolean;
  @JsonProperty()
  isRestrictCreatingNewReservationAfterTime: boolean;
  @JsonProperty()
  reservationTimeGranularity: string;
  @JsonProperty()
  isAllowUsersToEndReservationEarly: boolean;
  @JsonProperty()
  defaultReservationDuration: string;
  @JsonProperty()
  reservationDurationMinimum: string;
  @JsonProperty()
  reservationDurationMaximum: string;
  @JsonProperty()
  bufferTimeBeforeReservation: string;
}
