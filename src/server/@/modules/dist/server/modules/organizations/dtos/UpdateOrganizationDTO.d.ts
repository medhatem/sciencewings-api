import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
declare class BodyUpdateOrganizationDTO extends BaseBodyDTO {
    id: number;
}
export declare class UpdateOrganizationDTO extends BaseRequestDTO {
    body?: BodyUpdateOrganizationDTO;
    error?: BaseErrorDTO;
}
export {};
