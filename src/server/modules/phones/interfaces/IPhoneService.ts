import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models/User';

export abstract class IPhoneService extends IBaseService<any> {
  createBulkPhoneForUser: (payload: PhoneRO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneRO[], entity: Organization) => Promise<Result<number>>;
  createPhoneForMember: (payload: PhoneRO, entity: Member) => Promise<Result<Phone>>;
}
