import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { unique } from '@/decorators/Unique';

@Serializable()
@unique
export class CreateOrganizationRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  email: string;

  @JsonProperty()
  phones: PhoneDTO[];

  @JsonProperty()
  type: string;

  @JsonProperty()
  address: AddressDTO[];

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
