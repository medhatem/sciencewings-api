import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Organization } from '@/modules/organizations/models/Organization';
export declare class OrganizationDao extends BaseDao<Organization> {
    model: Organization;
    private constructor();
    static getInstance(): OrganizationDao;
}
