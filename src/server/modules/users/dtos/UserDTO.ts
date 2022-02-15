import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { PhoneRO } from '../../phones/routes/PhoneRO';
import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { User } from '../models';

class BaseBodyGetDTO extends BaseBodyDTO {
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

@Serializable()
export class UserDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
