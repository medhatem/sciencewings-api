import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ProjectDTO extends BaseRequestDTO {}

@JsonObject()
@unique
export class ProjectBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
