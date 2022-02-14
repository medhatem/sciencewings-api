import { Phone } from '../../phones/models/Phone';
import { Result } from '@utils/Result';
import { PhoneRO } from '../routes/PhoneRO';
import { Organization } from '../../organizations/models/Organization';
import { User } from '../../users/models/User';
import { IBaseService } from '../../base/interfaces/IBaseService';

export abstract class IPhoneService extends IBaseService<any> {
  createPhone: (payload: PhoneRO) => Promise<Result<Phone>>;
  createBulkPhoneForUser: (payload: PhoneRO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneRO[], entity: Organization) => Promise<Result<number>>;
}
