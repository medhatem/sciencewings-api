import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class GetUserOrganizationDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
}
