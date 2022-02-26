import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class PhoneRO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  id: number;

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

  @JsonProperty()
  memberId?: number;
}
