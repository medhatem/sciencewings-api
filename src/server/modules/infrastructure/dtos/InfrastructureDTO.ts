import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';
import { MemberDTO } from '@/modules/hr';
import { ResourceDTO } from '@/modules/resources';
import { OrganizationInformationDTO } from '@/modules/organizations/dtos/OrganizationDTO';

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

  @JsonProperty()
  default?: boolean;

  @JsonProperty()
  responsible?: MemberDTO;

  @JsonProperty()
  organization?: OrganizationInformationDTO;

  @JsonProperty({
    type: ResourceDTO,
    beforeDeserialize,
  })
  resources?: Array<ResourceDTO>;

  @JsonProperty()
  parent?: InfrastructureDTO;

  @JsonProperty({
    type: InfrastructureDTO,
    beforeDeserialize,
  })
  children?: Array<InfrastructureDTO>;
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
@JsonObject()
@unique
export class InfrastructureStatusObjectDTO extends BaseBodyDTO {
  @JsonProperty({
    beforeDeserialize: (prop: any) => {
      if (typeof prop === 'object') {
        return prop.id;
      }
      return prop;
    },
  })
  statusType: string;
}

@JsonObject()
@unique
export class InfrastructureResourceDetails extends BaseBodyDTO {
  @JsonProperty()
  name: string;
  @JsonProperty()
  status: InfrastructureStatusObjectDTO;
  @JsonProperty()
  createdAt: string;
}
@JsonObject()
@unique
export class InfrastructureResourcesDetailsList extends BaseBodyDTO {
  @JsonProperty({
    type: InfrastructureResourceDetails,
    beforeDeserialize,
  })
  data: Array<InfrastructureResourceDetails>;
}

@JsonObject()
@unique
export class InfrastructureResourcesRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: InfrastructureResourcesDetailsList;
}
