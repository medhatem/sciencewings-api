import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { AddressType } from '../../address/models/AdressModel';

@Serializable()
export class AddressRO {
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
  appartement: number;
}
