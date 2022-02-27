import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@Serializable()
@unique
export class ProjectDTO extends BaseRequestDTO {}

@Serializable()
@unique
class ProjectBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
