import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class GetUserOrganizationDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
}
