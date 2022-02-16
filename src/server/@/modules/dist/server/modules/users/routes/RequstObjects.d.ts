import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
export declare class UserInviteToOrgRO {
    organizationId: number;
    email: string;
}
export declare class UserDetailsRO {
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    phones: PhoneDTO[];
    dateofbirth: Date;
    signature?: string;
    actionId?: number;
    share?: boolean;
}
export declare class ResetPasswordRO {
    email: number;
    password: string;
    passwordConfirmation: string;
}
