import { Phone } from '@modules/phones/models/Phone';
import { Result } from '@utils/Result';
import { PhoneDTO } from '../dtos/PhoneDTO';
import { Organization } from '@modules/organizations/models/Organization';
import { User } from '@modules/users/models/User';
import { IBaseService } from '@modules/base/interfaces/IBaseService';

export abstract class IPhoneService extends IBaseService<any> {
  createPhone: (payload: PhoneDTO) => Promise<Result<Phone>>;
  createBulkPhoneForUser: (payload: PhoneDTO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneDTO[], entity: Organization) => Promise<Result<number>>;
}
