import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { unique } from '@/decorators/Unique';

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
  phones: PhoneDTO[];

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
