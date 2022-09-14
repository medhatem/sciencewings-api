import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { JobLevel, ContractTypes } from '@/modules/hr/models/Contract';
import { beforeDeserialize } from '@/utils/utilities';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { JobBaseBodyGetDTO } from '@/modules/hr/dtos//JobDTO';

@JsonObject()
@unique
export class ContracBaseBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  job?: JobBaseBodyGetDTO;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  member?: MemberDTO;

  @JsonProperty()
  jobLevel?: JobLevel;

  @JsonProperty()
  wage?: number;

  @JsonProperty()
  contractType?: ContractTypes;

  @JsonProperty()
  dateStart?: string;

  @JsonProperty()
  dateEnd?: string;

  @JsonProperty()
  supervisor?: MemberDTO;

  @JsonProperty()
  description?: string;
}
@JsonObject()
@unique
export class ContracBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ContracBaseBodyDTO;
}

@JsonObject()
@unique
export class UpdateContracBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ContracBaseBodyDTO;
}

@JsonObject()
@unique
export class ContractGetBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ContracBaseBodyDTO,
    beforeDeserialize,
  })
  data: Array<ContracBaseBodyDTO>;
}
@JsonObject()
@unique
export class AllContractsBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ContractGetBodyDTO;
}
