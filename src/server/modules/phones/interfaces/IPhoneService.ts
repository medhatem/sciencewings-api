import { Result } from '@utils/Result';
import { PhoneService } from '../services/PhoneService';
import { PhoneDTO } from '../dtos/PhoneDTO';
import { Organization } from '@modules/organizations/models/Organization';
import { User } from '@modules/users/models/User';

export abstract class IPhoneService {
  getInstance: () => PhoneService;

  createPhone: (payload: PhoneDTO) => Promise<Result<number>>;
  createBulkPhoneForUser: (payload: PhoneDTO[], entity: User) => Promise<Result<number>>;
  createBulkPhoneForOrganization: (payload: PhoneDTO[], entity: Organization) => Promise<Result<number>>;
}
