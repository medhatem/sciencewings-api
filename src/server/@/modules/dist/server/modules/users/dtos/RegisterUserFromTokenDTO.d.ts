import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
export declare class UserIdDTO extends BaseBodyDTO {
    userId: number;
}
export declare class ResetDTO extends BaseBodyDTO {
    message: string;
}
export declare class ErrorDTO extends BaseErrorDTO {
}
export declare class RegisterUserFromTokenDTO extends BaseRequestDTO {
    body?: UserIdDTO;
    error?: BaseErrorDTO;
}
export declare class ResetPasswordDTO extends BaseRequestDTO {
    body?: ResetDTO;
    error?: BaseErrorDTO;
}
