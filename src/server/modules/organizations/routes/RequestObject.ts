import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class CreateOrganizationRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  email: string;

  @JsonProperty()
  phones: PhoneRO[];

  @JsonProperty()
  type: string;

  @JsonProperty()
  address: AddressRO[];

  @JsonProperty()
  labels: string[];

  @JsonProperty()
  members: number[];

  @JsonProperty()
  direction: number;

  @JsonProperty()
  social_facebook?: string;
  @JsonProperty()
  social_twitter?: string;
  @JsonProperty()
  social_github?: string;
  @JsonProperty()
  social_linkedin?: string;
  @JsonProperty()
  social_youtube?: string;
  @JsonProperty()
  social_instagram?: string;

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
