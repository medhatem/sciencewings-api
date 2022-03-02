import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class JobDTO extends BaseRequestDTO {}

@Serializable()
@unique
class JobBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateJobDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: JobBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateJobDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: JobBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
