import { Result } from '@utils/Result';
import { Organization } from '../models/Organization';
import { OrganizationLabel } from '../models/OrganizationLabel';
import { OrganisationLabelService } from '../services/OrganisationLabelService';

export abstract class IOrganisationLabelService {
  getInstance: () => OrganisationLabelService;
  createLabel: (payload: OrganizationLabel) => Promise<Result<number>>;
  createBulkLabel: (payload: string[], organization: Organization) => Promise<Result<number>>;
}
