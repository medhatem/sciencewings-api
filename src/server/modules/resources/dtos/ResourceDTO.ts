import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { Resource } from '..';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class ResourceDTO extends BaseRequestDTO<Resource> {}
