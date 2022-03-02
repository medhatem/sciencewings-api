import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@unique
class UserBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  email: string;

  @JsonProperty()
  phones: PhoneRO[];

  @JsonProperty()
  keycloakId: string;
}

@unique
@Serializable()
export class UserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
