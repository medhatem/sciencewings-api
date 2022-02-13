import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class PhoneDTO {
  @JsonProperty()
  label: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  number: string;

  @JsonProperty()
  userId?: number;

  @JsonProperty()
  organizationId?: number;
}
