import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Organization } from '../models/Organization';
import { OrganizationLabel } from '../models/OrganizationLabel';
import { Result } from '@/utils/Result';
export abstract class IOrganizationLabelService extends IBaseService<any> {
  createLabel: (payload: OrganizationLabel) => Promise<Result<number>>;
  createBulkLabel: (payload: string[], organization: Organization) => Promise<Result<number>>;
}
