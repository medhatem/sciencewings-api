import { Address } from '@/modules/address/models/AdressModel';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressOrganizationDTO } from '@/modules/address/dtos/AddressDTO';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '../interfaces/IAddressService';
import { Result } from '@utils/Result';
export declare class AddressService extends BaseService<Address> implements IAddressService {
    dao: AddressDao;
    constructor(dao: AddressDao);
    static getInstance(): IAddressService;
    createAddress(payload: Address): Promise<Result<Address>>;
    createBulkAddress(payload: AddressOrganizationDTO[]): Promise<Result<number>>;
}
