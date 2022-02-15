import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { Resource } from './../models/Resource';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class CreateResourceDTO extends BaseRequestDTO<Resource> {}
