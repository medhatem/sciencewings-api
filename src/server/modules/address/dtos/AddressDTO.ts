import { dto, include } from 'dto-mapper';
import { AddressType } from '@modules/address/models/AdressModel';

@dto()
export class AddressOrganizationRO {
  @include()
  country: string;

  @include()
  province: string;

  @include()
  code: string;

  @include()
  type: AddressType;

  @include()
  city: string;

  @include()
  street: string;

  @include()
  appartement: number;
}
