import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class PhoneDTO {
  @JsonProperty()
  label: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  number: number;

  @JsonProperty()
  userId?: number;

  @JsonProperty()
  organizationId?: number;
}
