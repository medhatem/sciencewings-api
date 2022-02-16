import { BaseDao } from '@/modules/base/daos/BaseDao';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
export declare class OrganizationLabelDao extends BaseDao<OrganizationLabel> {
    model: OrganizationLabel;
    private constructor();
    static getInstance(): OrganizationLabelDao;
}
