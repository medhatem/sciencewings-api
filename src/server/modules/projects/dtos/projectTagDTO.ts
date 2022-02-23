import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class ProjectTagDTO extends BaseRequestDTO {}

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
export class UpdateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
