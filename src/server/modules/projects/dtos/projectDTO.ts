import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class ProjectDTO extends BaseRequestDTO {}

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
export class UpdateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
