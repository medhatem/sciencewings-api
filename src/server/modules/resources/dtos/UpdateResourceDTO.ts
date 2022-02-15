import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';
import { Resource } from '..';

@Serializable()
export class UpdateResourceDTO extends BaseRequestDTO<Resource> {}
