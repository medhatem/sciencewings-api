import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
export declare class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
    id: number;
}
export declare class CreateOrganizationDTO extends BaseRequestDTO {
    body?: RegisterUserFromTokenBodyDTO;
    error?: BaseErrorDTO;
}
