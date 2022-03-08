import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes';
import { PhoneRO } from '../../phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}

@Serializable()
@unique
export class UserRO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  email: string;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  address: Array<AddressRO>;

  @JsonProperty()
  phones: Array<PhoneRO>;

  @JsonProperty()
  dateofbirth: Date;

  @JsonProperty()
  signature?: string;

  @JsonProperty()
  keycloakId: string;

  @JsonProperty()
  actionId?: number;

  @JsonProperty()
  share?: boolean;
}

@unique
export class ResetPasswordRO {
  @JsonProperty()
  email: number;

  @JsonProperty()
  password: string;

  @JsonProperty()
  passwordConfirmation: string;
}
