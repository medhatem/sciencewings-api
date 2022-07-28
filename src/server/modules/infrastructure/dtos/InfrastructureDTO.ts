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
export class GetInfrastructuresBodyDTO extends BaseBodyDTO {
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
  public body?: GetInfrastructuresBodyDTO;
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
