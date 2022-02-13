import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { User } from '../models';

class BodyUpdateUserDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class UpdateUserDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  public body?: BodyUpdateUserDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
