import { BaseService } from '@/modules/base/services/BaseService';
import { IOrganizationLabelService } from '../interfaces/IOrganizationLabelService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { Result } from '@utils/Result';
export declare class OrganisationLabelService extends BaseService<OrganizationLabel> implements IOrganizationLabelService {
    dao: OrganizationLabelDao;
    constructor(dao: OrganizationLabelDao);
    static getInstance(): IOrganizationLabelService;
    createLabel(payload: OrganizationLabel): Promise<Result<number>>;
    createBulkLabel(payload: string[], organization: Organization): Promise<Result<number>>;
}
