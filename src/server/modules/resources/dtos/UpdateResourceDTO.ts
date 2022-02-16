import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class UpdateResourceDTO extends BaseRequestDTO {}
