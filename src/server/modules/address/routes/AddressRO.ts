import { JsonProperty, Serializable } from 'typescript-json-serializer';

export enum AddressType {
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
}

@Serializable()
export class AddressRO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  country: string;

  @JsonProperty()
  province: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  type: AddressType;

  @JsonProperty()
  city: string;

  @JsonProperty()
  street: string;

  @JsonProperty()
  apartment: string;
}
