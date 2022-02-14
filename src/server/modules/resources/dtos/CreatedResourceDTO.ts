import { Resource } from './../models/Resource';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class CreateResourceDTO extends BaseRequestDTO<Resource> {}
