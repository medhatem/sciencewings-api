import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class MemberDTO extends BaseRequestDTO {}
