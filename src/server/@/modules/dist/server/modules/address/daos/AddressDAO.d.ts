import { Address } from '@/modules/address/models/AdressModel';
import { BaseDao } from '@/modules/base/daos/BaseDao';
export declare class AddressDao extends BaseDao<Address> {
    model: Address;
    private constructor();
    static getInstance(): AddressDao;
}
