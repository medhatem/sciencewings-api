import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InviteUserBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class InviteUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body: InviteUserBodyDTO;
}
