import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class ProjectTagDTO extends BaseRequestDTO {}

@Serializable()
class ProjectTagBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
export class UpdateProjectTagDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectTagBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
