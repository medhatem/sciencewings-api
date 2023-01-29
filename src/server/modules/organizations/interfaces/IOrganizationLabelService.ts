import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';

export abstract class IOrganizationLabelService extends IBaseService<any> {
  createLabel: (payload: OrganizationLabel) => Promise<OrganizationLabel>;
  createBulkLabel: (payload: string[], organization: Organization) => Promise<void>;
}
