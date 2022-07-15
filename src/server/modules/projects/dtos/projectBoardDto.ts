import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@JsonObject()
@unique
export class ProjectBoardDTO extends BaseRequestDTO {}

@JsonObject()
@unique
export class ProjectBoardBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectBoardDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBoardBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateProjectBoardDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBoardBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
