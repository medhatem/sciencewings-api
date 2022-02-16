import { BaseDao } from '@/modules/base/daos/BaseDao';
import { User } from '@/modules/users/models/User';
export declare class UserDao extends BaseDao<User> {
    model: User;
    private constructor();
    static getInstance(): UserDao;
}
