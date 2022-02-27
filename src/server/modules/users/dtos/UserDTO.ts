import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { unique } from '@/decorators/Unique';

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
  phones: PhoneDTO[];

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
