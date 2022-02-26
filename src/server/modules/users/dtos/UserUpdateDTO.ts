import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

class BodyUpdateUserDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class UpdateUserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateUserDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
