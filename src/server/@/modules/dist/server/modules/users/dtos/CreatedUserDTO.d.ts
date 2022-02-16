import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
export declare class CreatedUserDTO extends BaseRequestDTO {
    body?: UserIdDTO;
    error?: BaseErrorDTO;
}
