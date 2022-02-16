import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Contract } from './../models/Contract';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class ContractDTO extends BaseRequestDTO {}
