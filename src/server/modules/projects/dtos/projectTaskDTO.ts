import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@Serializable()
@unique
export class ProjectTaskDTO extends BaseRequestDTO {}

@Serializable()
@unique
class ProjectTaskBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTaskBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTaskBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
