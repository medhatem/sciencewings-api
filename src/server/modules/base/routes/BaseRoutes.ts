import { BaseService } from '@modules/base/services/BaseService';
import { BaseModel } from '@modules/base/models/BaseModel';
import { provideSingleton } from '@di/index';

import { Path, GET, PUT, PathParam } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';
import { BaseDTO, BaseRequestDTO } from '../dtos/BaseDTO';
import { buildMapper, IMapper } from 'dto-mapper';

export interface Class<T> extends Function {
  new (): T;
}

@provideSingleton()
export class BaseRoutes<T extends BaseModel<T>, Y extends BaseDTO> {
  private getDTOMapper: IMapper<Y, unknown>;
  constructor(private service: BaseService<T>, private baseGetDTO: Class<Y>) {
    this.getDTOMapper = this.getMapper(this.baseGetDTO);
  }

  /**
   *
   * @param dto the dto to get the mapper for
   */
  getMapperFromRequest<EntityT, dtoT extends BaseRequestDTO>(dto: Class<dtoT>): IMapper<dtoT, unknown> {
    return buildMapper(dto);
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
  public async getById(@PathParam('id') id: number): Promise<BaseDTO> {
    const result = await this.service.get(id);
    return this.getDTOMapper.serialize(result);
  }

  @GET
  @Path('/getAll')
  @Response(200, 'success')
  @Response(401, 'error')
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();
    return result.map((r) => this.getDTOMapper.serialize(r));
  }

  //   public create(body: CreateBodyRO) {}

  @PUT
  @Path('/:id')
  @Response(201, 'success')
  public async update(@PathParam('id') id: number, payload: any): Promise<any> {
    console.log(id, payload);
    // await this.service.update(payload);
    // const updatedPayload = await this.service.get(id);
    // return new this.UpdateRO().serialize(await updatedPayload);
  }

  //   public delete(id: string) {}
}
