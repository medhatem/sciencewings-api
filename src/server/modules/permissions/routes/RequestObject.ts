import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class createPermissionRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  module!: string;

  @JsonProperty()
  operationDB!: string;
}

@JsonObject()
@unique
export class updatePermissionRO {
  @JsonProperty()
  name?: string;

  @JsonProperty()
  module?: string;

  @JsonProperty()
  operationDB?: string;
}
