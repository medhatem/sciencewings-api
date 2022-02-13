import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { PhoneDTO } from 'server';
import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { User } from '../models';
@Serializable()
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
  phones: PhoneDTO[];

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
