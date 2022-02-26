import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
class CreateMemberBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateMemberBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
