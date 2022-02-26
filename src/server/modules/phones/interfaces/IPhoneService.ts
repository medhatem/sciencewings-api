import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDTO } from '../dtos/PhoneDTO';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models/User';

export abstract class IPhoneService extends IBaseService<any> {
  createPhone: (payload: PhoneDTO) => Promise<Result<Phone>>;
  createBulkPhoneForUser: (payload: PhoneDTO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneDTO[], entity: Organization) => Promise<Result<number>>;
}
