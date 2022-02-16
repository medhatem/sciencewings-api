import { BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
export declare class InviteUserDTO extends BaseRequestDTO {
    body?: UserIdDTO;
    error?: BaseErrorDTO;
}
