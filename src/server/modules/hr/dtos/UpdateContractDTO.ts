import { Contract } from './../models/Contract';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class UpdateContractDTO extends BaseRequestDTO<Contract> {}
