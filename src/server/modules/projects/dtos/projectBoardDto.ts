import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@JsonObject()
@unique
@JsonObject()
@unique
export class ProjectBoardDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectBoardDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBoardDTO;
}

@JsonObject()
@unique
export class UpdateProjectBoardDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBoardDTO;
}
