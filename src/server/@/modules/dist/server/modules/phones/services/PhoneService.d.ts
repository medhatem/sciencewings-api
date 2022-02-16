import { BaseService } from '@/modules/base/services/BaseService';
import { IPhoneService } from '../interfaces/IPhoneService';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { Result } from '@utils/Result';
import { User } from '@/modules/users/models/User';
export declare class PhoneService extends BaseService<Phone> implements IPhoneService {
    dao: PhoneDao;
    constructor(dao: PhoneDao);
    static getInstance(): IPhoneService;
    createPhone(payload: PhoneDTO): Promise<Result<Phone>>;
    createBulkPhoneForUser(payload: PhoneDTO[], entity: User): Promise<Result<number>>;
    createBulkPhoneForOrganization(payload: PhoneDTO[], entity: Organization): Promise<Result<number>>;
}
