import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
@Serializable()
@unique
export class ProjectTagDTO extends BaseRequestDTO {}

@Serializable()
@unique
class ProjectTagBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
