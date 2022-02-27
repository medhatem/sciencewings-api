import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';
import { unique } from '@/decorators/Unique';

@Serializable()
@unique
export class ResourceDTO extends BaseRequestDTO {}
