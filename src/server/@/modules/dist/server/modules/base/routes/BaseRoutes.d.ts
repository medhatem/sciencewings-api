import { BaseService } from '@/modules/base/services/BaseService';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { BaseRequestDTO } from '../dtos/BaseDTO';
import { Logger } from '@utils/Logger';
export declare class BaseRoutes<T extends BaseModel<T>> {
    private service;
    private baseGetDTO;
    private baseUpdateDTO;
    private getDTOMapper;
    private updateDTOMapper;
    logger: Logger;
    constructor(service: BaseService<T>, baseGetDTO: BaseRequestDTO, baseUpdateDTO: BaseRequestDTO);
    getById(id: number): Promise<BaseRequestDTO>;
    getAll(): Promise<any>;
    update(id: number, payload: any): Promise<any>;
    remove(id: number): Promise<any>;
}
