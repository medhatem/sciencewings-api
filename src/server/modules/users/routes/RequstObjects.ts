import { JsonProperty, Serializable } from 'typescript-json-serializer';

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
export class UserDetailsRO {
  @JsonProperty()
  email: string;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  address: string;

  @JsonProperty()
  phones: PhoneRO[];

  @JsonProperty()
  dateofbirth: Date;

  @JsonProperty()
  signature?: string;

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
