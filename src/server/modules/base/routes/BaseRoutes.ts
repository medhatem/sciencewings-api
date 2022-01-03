import { BaseService } from '@modules/base/services/BaseService';
import { BaseRO } from './RequestObject';
import { BaseModel } from '@modules/base/models/BaseModel';
import { provideSingleton } from '@di/index';

import { Path, GET, PUT, PathParam } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';
import { BaseDTO } from '../dtos/BaseDTO';
import { buildMapper, IMapper } from 'dto-mapper';

export interface Class<T> extends Function {
  new (): T;
}

@provideSingleton()
export class BaseRoutes<T extends BaseModel<T>> {
  public getRO: typeof BaseRO;
  public UpdateRO: typeof BaseRO;

  constructor(private service: BaseService<T>, getRO?: typeof BaseRO, updateRO?: typeof BaseRO) {
    this.getRO = getRO;
    this.UpdateRO = updateRO;
  }

  /**
   *
   * @param dto the dto to get the mapper for
   */
  getMapper<EntityT, dtoT extends BaseDTO>(dto: Class<dtoT>): IMapper<dtoT, unknown> {
    return buildMapper(dto);
  }

  /**
   *
   * @param dto the dto to get the mapper for
   */
  getRequestMapper<EntityT, dtoT>(dto: Class<dtoT>): IMapper<dtoT, unknown> {
    return buildMapper(dto);
  }

  @GET
  @Path('/getById/:id')
  @Response(200, 'success')
  public async getById(@PathParam('id') id: number): Promise<any> {
    const result = await (await this.service.get(id)).toObject();
    return new this.getRO().serialize(result);
  }

  @GET
  @Path('/getAll')
  @Response(200, 'success')
  @Response(401, 'error')
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();
    return Promise.all(result.map(async (r) => new this.getRO().serialize(await r.toObject())));
  }

  //   public create(body: CreateBodyRO) {}

  @PUT
  @Path('/:id')
  @Response(201, 'success')
  public async update(@PathParam('id') id: number, payload: any): Promise<BaseRO> {
    await this.service.update(id, payload);
    const updatedPayload = await this.service.get(id);
    return new this.UpdateRO().serialize(await updatedPayload.toObject());
  }

  //   public delete(id: string) {}
}
