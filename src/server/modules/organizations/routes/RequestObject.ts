import { AddressOrganizationDTO } from '../../address/dtos/AddressDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { PhoneDTO } from '../../phones/dtos/PhoneDTO';

@Serializable()
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
  address: AddressOrganizationDTO[];

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
export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}
