import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';

@JsonObject()
@unique
export class permissionDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;

  @JsonProperty()
  name!: string;

  @JsonProperty()
  module!: string;

  @JsonProperty()
  operation!: string;
}

@JsonObject()
@unique
export class PermssionGetBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: permissionDTO,
    beforeDeserialize,
  })
  data: Array<permissionDTO>;
}

@JsonObject()
@unique
export class PermissionGetAllDTO extends BaseRequestDTO {
  @JsonProperty()
  body: PermssionGetBodyDTO;
}

@JsonObject()
@unique
export class CreatePermissionDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: permissionDTO;
}

@JsonObject()
@unique
export class UpdatePermissionDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: permissionDTO;
}

@JsonObject()
@unique
export class permissionGetDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: permissionDTO;
}
