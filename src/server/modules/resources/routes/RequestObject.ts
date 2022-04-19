import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

//Resource settings
@JsonObject()
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

@JsonObject()
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
}

@JsonObject()
@unique
export class ResourcesSettingsReservationUnitRO {
  @JsonProperty()
  unitName: string;
  @JsonProperty()
  unitLimit: number;
  @JsonProperty()
  unites: number;
}

@JsonObject()
@unique
export class ResourceSettingsGeneralStatusRO {
  @JsonProperty()
  statusType: string;
  @JsonProperty()
  statusDescription: string;
}

@JsonObject()
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

export class ResourceSettingsGeneralVisibilityRO {
  @JsonProperty()
  visibility: boolean;
  @JsonProperty()
  isUnlistedOnOrganizationPage: boolean;
  @JsonProperty()
  isUnlistedToUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isFullyHiddentoUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isPromotedOnSitePageAsALargeButtonAboveOtherResources: boolean;
  @JsonProperty()
  isHideAvailabilityonSitePage: boolean;
}

@JsonObject()
@unique
export class ResourceReservationVisibilityRO {
  @JsonProperty()
  isReservationDetailsVisibilityToNonModerators: string;
}

export class ResourceSettingsGeneralPropertiesRO {
  @JsonProperty()
  accessToResource: string;
}

@JsonObject()
@unique
export class ResourceManagerRO {
  @JsonProperty()
  id?: number;

  @JsonProperty()
  organization: number;

  @JsonProperty()
  user: number;
}

@JsonObject()
@unique
export class ResourceTagRO {
  @JsonProperty()
  id?: number;

  @JsonProperty()
  title!: string;
}

@JsonObject()
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

@JsonObject()
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
  resourceClass!: string;

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

@JsonObject()
@unique
export class ResourceEventRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  dateFrom: Date;

  @JsonProperty()
  dateTo: Date;
}
