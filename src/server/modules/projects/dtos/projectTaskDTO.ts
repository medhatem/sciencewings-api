import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class ProjectTaskDTO extends BaseRequestDTO {}

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
export class UpdateProjectTaskDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
