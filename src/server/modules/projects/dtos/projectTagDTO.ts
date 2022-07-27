import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@JsonObject()
@unique
@JsonObject()
@unique
export class ProjectTagDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagDTO;
}

@JsonObject()
@unique
export class UpdateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagDTO;
}
