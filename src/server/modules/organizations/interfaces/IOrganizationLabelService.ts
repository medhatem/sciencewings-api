import { Result } from '@utils/Result';
import { Organization } from '../models/Organization';
import { OrganizationLabel } from '../models/OrganizationLabel';
export abstract class IOrganizationLabelService {
  createLabel: (payload: OrganizationLabel) => Promise<Result<number>>;
  createBulkLabel: (payload: string[], organization: Organization) => Promise<Result<number>>;
}
