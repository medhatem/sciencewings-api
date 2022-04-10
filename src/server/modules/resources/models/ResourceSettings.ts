import { BooleanType, Entity, PrimaryKey, Property, StringType } from '@mikro-orm/core';
import { provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class ResourceSettings extends BaseModel<ResourceSettings> {
  @PrimaryKey()
  id?: number;
  //Resource settings
  // General
  // general
  // status
  @Property({ type: StringType })
  statusType = '';
  @Property({ type: StringType })
  statusDescription = '';
  // visibility
  @Property({ type: BooleanType })
  visibility = true;
  @Property({ type: BooleanType })
  isUnlistedOnSitePage = false;
  @Property({ type: BooleanType })
  isUnlistedToUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isFullyHiddentoUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isPromotedOnSitePageAsALargeButtonAboveOtherResources = false;
  @Property({ type: BooleanType })
  isHideAvailabilityonSitePage = false;
  // Properties
  @Property({ type: StringType })
  accessToResource = '';
}
