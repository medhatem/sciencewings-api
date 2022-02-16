import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Phone } from '@/modules/phones/models/Phone';
export declare class PhoneDao extends BaseDao<Phone> {
    model: Phone;
    private constructor();
    static getInstance(): PhoneDao;
}
