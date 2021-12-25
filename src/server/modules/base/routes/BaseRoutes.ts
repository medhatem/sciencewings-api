import { BaseService } from '@modules/base/services/BaseService';
import { BaseRO } from './RequestObject';
import { BaseModel } from '@modules/base/models/BaseModel';
import { Controller, Get, Path, SuccessResponse, Response, Put, Body } from 'tsoa';
import { provideSingleton } from '@di/index';

@provideSingleton()
export class BaseRoutes<T extends BaseModel<T>> extends Controller {
  public getRO: typeof BaseRO;
  public UpdateRO: typeof BaseRO;

  constructor(private service: BaseService<T>, getRO?: typeof BaseRO, updateRO?: typeof BaseRO) {
    super();
    this.getRO = getRO;
    this.UpdateRO = updateRO;
  }

  @Get('{id}')
  @SuccessResponse(200, 'success')
  public async getById(@Path('id') id: string): Promise<any> {
    const result = await (await this.service.get(id)).toObject();
    return new this.getRO().serialize(result);
  }

  @Get('/getAll')
  @SuccessResponse(200, 'success')
  @Response(401, 'error')
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();
    return Promise.all(result.map(async (r) => new this.getRO().serialize(await r.toObject())));
  }

  //   public create(body: CreateBodyRO) {}

  @Put('{id}')
  @SuccessResponse(201, 'success')
  public async update(@Path('id') id: string, @Body() payload: any): Promise<BaseRO> {
    await this.service.update(id, payload);
    const updatedPayload = await this.service.get(id);
    return new this.UpdateRO().serialize(await updatedPayload.toObject());
  }

  //   public delete(id: string) {}
}
