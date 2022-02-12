import { BaseRequestDTO } from '@modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class MemberDTO extends BaseRequestDTO {
  @include()
  memberId!: number;
}
