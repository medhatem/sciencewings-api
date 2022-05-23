import { BooleanType, Entity, OneToOne, PrimaryKey, Property, StringType } from '@mikro-orm/core';
import { provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResourceStatus } from '@/modules/resources/models/ResourceStatus';

@provide()
@Entity()
export class ResourceSettings extends BaseModel<ResourceSettings> {
  @PrimaryKey()
  id?: number;
  //Resource settings
  //general
  @Property({ type: BooleanType })
  isEnabled = true;
  @Property({ type: BooleanType })
  isLoanable = false;
  @Property({ type: BooleanType })
  isReturnTheirOwnLoans = false;
  @Property({ type: BooleanType })
  isReservingLoansAtFutureDates = false;
  @Property({ type: StringType })
  fixedLoanDuration = '0 days';
  @Property({ type: StringType })
  overdueNoticeDelay = '0 days';
  @Property({ type: StringType })
  recurringReservations = '0 days';

  //Unit
  @Property({ type: StringType })
  unitName = '';
  @Property({ type: Number })
  unitLimit = 0;
  @Property({ type: Number })
  unites = 0;

  // Time restriction
  @Property({ type: BooleanType })
  isEditingWindowForUsers = false;
  @Property({ type: BooleanType })
  isRestrictCreatingNewReservationBeforeTime = false;
  @Property({ type: BooleanType })
  isRestrictCreatingNewReservationAfterTime = false;
  @Property({ type: StringType })
  reservationTimeGranularity = '';
  @Property({ type: BooleanType })
  isAllowUsersToEndReservationEarly = false;
  @Property({ type: StringType })
  defaultReservationDuration = '';
  @Property({ type: StringType })
  reservationDurationMinimum = '';
  @Property({ type: StringType })
  reservationDurationMaximum = '';
  @Property({ type: StringType })
  bufferTimeBeforeReservation = '';

  // Group

  // visibility
  @Property({ type: BooleanType })
  isReservationDetailsVisibilityToNonModerators = false;

  @OneToOne({
    entity: () => ResourceStatus,
  })
  statusType: ResourceStatus;

  @Property({ type: StringType })
  statusDescription = '';

  @Property({ type: BooleanType })
  visibility = true;
  @Property({ type: BooleanType })
  isUnlistedOnOrganizationPage = false;
  @Property({ type: BooleanType })
  isUnlistedToUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isFullyHiddentoUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isPromotedOnSitePageAsALargeButtonAboveOtherResources = false;
  @Property({ type: BooleanType })
  isHideAvailabilityonSitePage = false;

  @Property({ type: StringType })
  accessToResource = '';
}
