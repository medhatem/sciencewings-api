import { GET, Path, Security, PathParam, PUT } from 'typescript-rest';

import { BaseService } from '../../service/BaseService';
import { Response } from 'typescript-rest-swagger';
import { BaseRO } from './RequestObject';
import { BaseModel } from '@models/BaseModel';

export class BaseRoutes<T extends BaseModel<T>> {
  public getRO: typeof BaseRO;
  public UpdateRO: typeof BaseRO;

  constructor(private service: BaseService<T>, getRO: typeof BaseRO, updateRO: typeof BaseRO) {
    this.getRO = getRO;
    this.UpdateRO = updateRO;
  }

  @Path('/getById/:id')
  @GET
  @Response('success')
  @Response('error')
  @Security()
  public async getById(@PathParam('id') id: string): Promise<any> {
    const result = await (await this.service.get(id)).toObject();
    return new this.getRO().serialize(result);
  }

  @Path('/getAll')
  @GET
  @Response(200, 'success')
  @Response(401, 'Not Authenticated')
  @Security()
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();
    return Promise.all(result.map(async (r) => new this.getRO().serialize(await r.toObject())));
  }

  //   public create(body: CreateBodyRO) {}

  @Path('/:id')
  @PUT
  @Response('success')
  public async update(@PathParam('id') id: string, payload: any): Promise<BaseRO> {
    await this.service.update(id, payload);
    const updatedPayload = await this.service.get(id);
    return new this.UpdateRO().serialize(await updatedPayload.toObject());
  }

  //   public delete(id: string) {}
}
