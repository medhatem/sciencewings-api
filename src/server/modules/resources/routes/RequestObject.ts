import { unique } from '@/decorators/unique';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

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
export class ResourceSettingsGeneralPropertiesRO {
  @JsonProperty()
  accessToResource: string;
}
