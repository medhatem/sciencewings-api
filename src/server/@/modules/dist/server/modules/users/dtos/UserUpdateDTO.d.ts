import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
declare class BodyUpdateUserDTO extends BaseBodyDTO {
    id: number;
}
export declare class UpdateUserDTO extends BaseRequestDTO {
    body?: BodyUpdateUserDTO;
    error?: BaseErrorDTO;
}
export {};
