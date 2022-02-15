import { Member } from './../models/Member';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class MemberDTO extends BaseRequestDTO<Member> {}
