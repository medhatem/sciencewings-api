import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class GetUserOrganizationDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
}
