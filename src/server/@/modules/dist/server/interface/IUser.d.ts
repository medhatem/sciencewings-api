import { IAddress } from './IAddress';
import { IBase } from './IBase';
import { IUserProfessionalMetadata } from './IUserProfessionalMetadata';
export interface IUser extends IBase {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: IAddress;
    professional: IUserProfessionalMetadata;
}
