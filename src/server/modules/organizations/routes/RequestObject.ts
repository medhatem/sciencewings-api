import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

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
  adminContact?: number;

  @JsonProperty()
  parent?: number;
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
