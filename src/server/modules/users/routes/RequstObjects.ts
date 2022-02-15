import { PhoneRO } from '../../phones/routes/PhoneRO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';

export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}

@Serializable()
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
export class ResetPasswordRO {
  @JsonProperty()
  email: number;

  @JsonProperty()
  password: string;

  @JsonProperty()
  passwordConfirmation: string;
}
