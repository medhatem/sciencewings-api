import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Organization } from '@/modules/organizations/models/Organization';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { User } from '@/modules/users/models/User';

export abstract class IPhoneService extends IBaseService<any> {
  createBulkPhoneForUser: (payload: PhoneRO[], entity: User) => Promise<void>;
  createBulkPhoneForOrganization: (payload: PhoneRO[], entity: Organization) => Promise<void>;
}
