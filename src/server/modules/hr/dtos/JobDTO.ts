import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { JobState } from '@/modules/hr/models/Job';

@JsonObject()
@unique
export class JobDTO extends BaseRequestDTO {}

@JsonObject()
@unique
export class JobBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name?: string;

  @JsonProperty()
  state?: JobState;
}

@JsonObject()
@unique
export class CreateJobDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: JobBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateJobDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: JobBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
