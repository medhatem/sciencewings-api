import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';

@JsonObject()
@unique
export class InfrastructureDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  name?: string;
  @JsonProperty()
  description?: string;
  @JsonProperty()
  key?: string;
}
@JsonObject()
@unique
export class GetInfrastructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body: InfrastructureDTO;
}
@JsonObject()
@unique
export class GetInfrastructuresDTO extends BaseBodyDTO {
  @JsonProperty({
    type: InfrastructureDTO,
    beforeDeserialize,
  })
  data: Array<InfrastructureDTO>;
}
@JsonObject()
@unique
export class GetAllInfrastructuresDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: GetInfrastructuresDTO;
}

@JsonObject()
@unique
export class infrastructureGetDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}

@JsonObject()
@unique
export class CreateInfrastructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}

@JsonObject()
@unique
export class UpdateInfrastructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}

@JsonObject()
@unique
export class InfrastructureResponsableObjectDTO extends BaseBodyDTO {
  @JsonProperty({
    beforeDeserialize: (prop: any) => {
      if (typeof prop === 'object') {
        return prop.id;
      }
      return prop;
    },
  })
  user?: number;
  @JsonProperty()
  name: string;
  @JsonProperty()
  workEmail: string;
}

@JsonObject()
@unique
export class SubInfrastructureObjectDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  name?: string;
}

@JsonObject()
@unique
export class InfrustructureListLineDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  name: string;
  @JsonProperty()
  key: string;
  @JsonProperty()
  responsible: InfrastructureResponsableObjectDTO;
  @JsonProperty()
  resourcesNb: number;
  @JsonProperty({ type: SubInfrastructureObjectDTO, beforeDeserialize })
  subInfrastructure: Array<SubInfrastructureObjectDTO>;
}

@JsonObject()
@unique
export class InfrastructureListBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: InfrustructureListLineDTO,
    beforeDeserialize,
  })
  data: Array<InfrustructureListLineDTO>;
}

@JsonObject()
@unique
export class InfrastructureListRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: InfrastructureListBodyDTO;
}
