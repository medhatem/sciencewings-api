import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

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
export class CreateOrganizationRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  email: string;

  @JsonProperty({
    type: PhoneRO,
  })
  phones?: Array<PhoneRO>;
  @JsonProperty()
  type: string;

  @JsonProperty({
    type: AddressRO,
  })
  addresses?: Array<AddressRO>;

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

@JsonObject()
@unique
export class UpdateOrganizationRO {
  @JsonProperty()
  name?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  email?: string;

  @JsonProperty()
  type?: string;

  @JsonProperty()
  labels?: Array<string>;

  @JsonProperty()
  direction?: number;

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
  admin_contact?: number;

  /*  @JsonProperty()
  parent?: number;*/
}

@JsonObject()
@unique
export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}
@JsonObject()
@unique
export class UserResendPassword {
  @JsonProperty()
  userId: number;

  @JsonProperty()
  orgId: number;
}
// resource ROs

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
