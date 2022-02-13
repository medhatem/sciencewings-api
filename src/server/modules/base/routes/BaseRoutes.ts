import { BaseService } from '../../base/services/BaseService';
import { BaseModel } from '../../base/models/BaseModel';
import { provideSingleton } from '@di/index';
import { Path, GET, PUT, PathParam, DELETE, Security } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';
import { BaseDTO, BaseRequestDTO } from '../dtos/BaseDTO';
import { buildMapper, Class, IMapper } from 'dto-mapper';
import { Logger } from '@utils/Logger';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';

@provideSingleton()
export class BaseRoutes<T extends BaseModel<T>> {
  private getDTOMapper: IMapper<BaseRequestDTO, unknown>;
  private updateDTOMapper: IMapper<BaseRequestDTO, unknown>;
  public logger: Logger;
  constructor(
    private service: BaseService<T>,
    private baseGetDTO: Class<BaseRequestDTO>,
    private baseUpdateDTO: Class<BaseRequestDTO>,
  ) {
    this.getDTOMapper = this.getMapperFromRequest(this.baseGetDTO);
    this.updateDTOMapper = this.getMapperFromRequest(this.baseUpdateDTO);
    this.logger = Logger.getInstance();
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
  @Security([], KEYCLOAK_TOKEN)
  @Response(200, 'success')
  public async getById(@PathParam('id') id: number): Promise<BaseRequestDTO> {
    const result = await this.service.get(id);
    if (result.isFailure) {
      return this.getDTOMapper.serialize({
        error: { statusCode: 500, message: result.error },
      });
    }
    return this.getDTOMapper.serialize({
      body: { statusCode: 204, ...result.getValue() },
    });
  }

  @GET
  @Path('/getAll')
  @Security([], KEYCLOAK_TOKEN)
  @Response(200, 'success')
  @Response(401, 'error')
  public async getAll(): Promise<any> {
    const result = await this.service.getAll();
    if (result.isFailure) {
      return this.getDTOMapper.serialize({
        error: { statusCode: 500, message: result.error },
      });
    }
    // return result.map((r) => this.getDTOMapper.serialize(r));
    return this.getDTOMapper.serialize({
      body: { statusCode: 204, enities: result.getValue() },
    });
  }

  @PUT
  @Path('/:id')
  @Security([], KEYCLOAK_TOKEN)
  @Response(204, 'success')
  public async update(@PathParam('id') id: number, payload: any): Promise<any> {
    const currentEntity = await this.service.get(id);
    if (currentEntity.isFailure || (await currentEntity.getValue()) === null) {
      return this.updateDTOMapper.serialize({
        error: { statusCode: 404, message: `Entity with id ${id} does not exist` },
      });
    }

    const entity = {
      ...currentEntity.getValue(),
      ...payload,
    };

    const result = await this.service.update(entity);
    if (result.isFailure) {
      return this.updateDTOMapper.serialize({
        error: { statusCode: 500, message: result.error },
      });
    }
    return this.updateDTOMapper.serialize({
      body: { statusCode: 204, entityId: result.getValue() },
    });
  }

  @DELETE
  @Path('/:id')
  @Security([], KEYCLOAK_TOKEN)
  @Response(201, 'success')
  public async remove(@PathParam('id') id: number): Promise<any> {
    const currentEntity = await this.service.get(id);
    if (currentEntity.isFailure || currentEntity.getValue() === null) {
      return new BaseRequestDTO().serialize({
        error: { statusCode: 404, userId: `Entity with id ${id} does not exist` },
      });
    }
    const result = await this.service.remove(id);
    if (result.isFailure) {
      return new BaseRequestDTO().serialize({
        error: { statusCode: 500, error: result.error },
      });
    }
    return new BaseRequestDTO().serialize({
      body: { statusCode: 204, entityId: result.getValue() },
    });
  }
}
