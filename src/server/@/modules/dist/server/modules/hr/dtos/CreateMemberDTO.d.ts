import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
declare class BaseBodyGetDTO extends BaseBodyDTO {
    id: number;
}
export declare class CreateMemberDTO extends BaseRequestDTO {
    body?: BaseBodyGetDTO;
    error?: BaseErrorDTO;
}
export {};
