import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

export class UserInviteToOrgRO {
  @JsonProperty()
  email: string;

  @JsonProperty()
  organizationId: number;
}

@JsonObject()
@unique
export class UserRO {
  @JsonProperty()
  email: string;

  @JsonProperty()
  firstname?: string;

  @JsonProperty()
  lastname?: string;

  @JsonProperty()
  address: AddressRO;

  @JsonProperty()
  phones?: Array<PhoneRO>;

  @JsonProperty()
  dateofbirth?: Date;

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
  email: string;

  @JsonProperty()
  password: string;

  @JsonProperty()
  passwordConfirmation: string;
}
