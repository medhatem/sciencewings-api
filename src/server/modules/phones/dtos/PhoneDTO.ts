import { dto, include } from 'dto-mapper';

@dto()
export class PhoneDTO {
  @include()
  label: string;

  @include()
  code: string;

  @include()
  number: number;

  @include()
  userId?: number;

  @include()
  organizationId?: number;
}
