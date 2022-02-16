import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';
import { Resource } from '../models/Resource';

@Serializable()
export class UpdateResourceDTO extends BaseRequestDTO {}
