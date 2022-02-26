import { BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public error?: BaseErrorDTO;
}
