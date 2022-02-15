import { IBaseService } from '../../base/interfaces/IBaseService';
import { Member } from './../../hr/models/Member';
import { Organization } from '../../organizations/models/Organization';
import { Phone } from './../models/Phone';
import { PhoneRO } from '../routes/PhoneRO';
import { Result } from '@utils/Result';
import { User } from '../../users/models/User';

export abstract class IPhoneService extends IBaseService<any> {
  createBulkPhoneForUser: (payload: PhoneRO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneRO[], entity: Organization) => Promise<Result<number>>;
  createPhoneForMember: (payload: PhoneRO, entity: Member) => Promise<Result<Phone>>;
}
