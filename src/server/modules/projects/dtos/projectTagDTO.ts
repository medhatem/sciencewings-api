import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@JsonObject()
@unique
export class ProjectTagDTO extends BaseRequestDTO {}

@JsonObject()
@unique
class ProjectTagBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
