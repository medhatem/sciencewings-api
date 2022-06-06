import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@JsonObject()
@unique
export class ProjectTaskDTO extends BaseRequestDTO {}

@JsonObject()
@unique
class ProjectTaskBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTaskBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTaskBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
