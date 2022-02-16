import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
declare class BaseBodyGetDTO extends BaseBodyDTO {
    id: number;
    name: string;
    parent: any;
}
export declare class OrganizationDTO extends BaseRequestDTO {
    body?: BaseBodyGetDTO;
    error?: BaseErrorDTO;
}
export {};
