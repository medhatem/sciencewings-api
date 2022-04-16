import { BooleanType, Entity, PrimaryKey, Property, StringType } from '@mikro-orm/core';
import { provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class ResourceSettings extends BaseModel<ResourceSettings> {
  @PrimaryKey()
  id?: number;

  @Property({ type: StringType })
  statusType = '';
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
