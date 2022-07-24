import { BaseService } from '@/modules/base/services/BaseService';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { provideSingleton } from '@/di/index';
import { Path, GET, PUT, PathParam, DELETE, Security } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { Logger } from '@/utils/Logger';

@provideSingleton()
export class BaseRoutes<T extends BaseModel<T>> {
  private getDTOMapper: BaseRequestDTO;
  private updateDTOMapper: BaseRequestDTO;
  public logger: Logger;
  constructor(
    private service: BaseService<T>,
    private baseGetDTO: BaseRequestDTO,
    private baseUpdateDTO: BaseRequestDTO,
  ) {
    this.getDTOMapper = this.baseGetDTO;
    this.updateDTOMapper = this.baseUpdateDTO;
    this.logger = Logger.getInstance();
  }

  @GET
  @Path('/getById/:id')
  @Security()
  @Response<BaseRequestDTO>(200, 'success')
  public async getById(@PathParam('id') id: number): Promise<BaseRequestDTO> {
    const result = await this.service.get(id, { populate: true });

    return this.getDTOMapper.deserialize({
      body: { statusCode: 200, data: [...([result] || [])] },
    });
  }

  @GET
  @Path('/getAll')
  @Security()
  @Response(200, 'success')
  @Response(401, 'error')
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();

    return this.getDTOMapper.deserialize({
      body: { statusCode: 200, data: [...(result || [])] },
    });
  }

  @PUT
  @Path('/:id')
  @Security()
  @Response(204, 'success')
  public async update(@PathParam('id') id: number, payload: any): Promise<any> {
    const currentEntity = await this.service.updateRoute(id, payload);

    return this.updateDTOMapper.serialize({
      body: { statusCode: 204, id: currentEntity.id },
    });
  }

  @DELETE
  @Path('/:id')
  @Security()
  @Response(201, 'success')
  public async remove(@PathParam('id') id: number): Promise<any> {
    await this.service.removeRoute(id);

    return new BaseRequestDTO().serialize({
      body: { statusCode: 204, id },
    });
  }
}
