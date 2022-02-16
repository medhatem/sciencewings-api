import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
declare class BaseBodyGetDTO extends BaseBodyDTO {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phones: PhoneDTO[];
    keycloakId: string;
}
export declare class UserDTO extends BaseRequestDTO {
    body?: BaseBodyGetDTO;
    error?: BaseErrorDTO;
}
export {};
