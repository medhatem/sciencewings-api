import { container, provideSingleton } from '@/di/index';
import { DELETE, GET, Path, PathParam, POST, PUT, QueryParam, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { InfrastructureRO, UpdateinfrastructureRO } from './RequestObject';
import {
  CreateInfrastructureDTO,
  GetAllInfrastructuresDTO,
  GetInfrastructureDTO,
  infrastructureGetDTO,
  InfrastructureListRequestDTO,
  InfrastructureResourcesRequestDTO,
  subInfraListRequestDTO,
  UpdateInfrastructureDTO,
} from '@/modules/infrastructure/dtos/InfrastructureDTO';

@provideSingleton()
@Path('infrastructure')
export class InfrastructureRoutes extends BaseRoutes<Infrastructure> {
  constructor(private InfrastructureService: IInfrastructureService) {
    super(InfrastructureService as any, new CreateInfrastructureDTO(), new infrastructureGetDTO());
  }

  static getInstance(): InfrastructureRoutes {
    return container.get(InfrastructureRoutes);
  }

  /**
   * @override create an infrustructure in the database
   * @param payload Should contain infrustructure data
   */
  @POST
  @Path('create')
  @Security(['{orgId}-create-infrastructure'])
  @LoggerStorage()
  @Response<infrastructureGetDTO>(204, 'infrastructure created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createInfrastructure(payload: InfrastructureRO): Promise<CreateInfrastructureDTO> {
    const result = await this.InfrastructureService.createinfrastructure(payload);

    return new CreateInfrastructureDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * @override Update a infrustructure in the database
   * @param payload Should contain infrustructure data that include infrustructure data with its id
   * @param id id of the requested infrustructure
   */
  @PUT
  @Path('update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateInfrastructureDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateinfrastructure(
    payload: UpdateinfrastructureRO,
    @PathParam('id') id: number,
  ): Promise<UpdateInfrastructureDTO> {
    const result = await this.InfrastructureService.updateInfrastructure(payload, id);

    return new UpdateInfrastructureDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * retrieve Organization infrustructures by organization id
   * @param orgId organization id
   * @param page displayed page
   * @param size number of item to display in one page
   */
  @GET
  @Path('getAll/:orgId')
  @Security(['{orgId}-view-organization-infras'])
  @LoggerStorage()
  @Response<GetAllInfrastructuresDTO>(200, 'Organization infrustructures retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllOrganizationInfrastructures(
    @PathParam('orgId') orgId: number,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
  ): Promise<GetAllInfrastructuresDTO> {
    const result = await this.InfrastructureService.getAllOgranizationInfrastructures(
      orgId,
      page || null,
      size || null,
    );

    if (result?.pagination)
      return new GetAllInfrastructuresDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else
      return new GetAllInfrastructuresDTO({
        body: { data: result, statusCode: 200 },
      });
  }

  /**
   * get the list of infrastructure of a given organization
   * @param orgId: organization id
   * @param page displayed page
   * @param size number of item to display in one page
   * @param query of type string used to do the search
   * @param query of type string used to do the search
   */
  @GET
  @Path('getAllInfrastructuresOfAgivenOrganization/:orgId')
  @Security(['{orgId}-view-organization-infras'])
  @LoggerStorage()
  @Response<InfrastructureListRequestDTO>(200, 'Return infrastructure list Successfully')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllInfrastructuresOfAgivenOrganization(
    @PathParam('orgId') orgId: number,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
    @QueryParam('query') query?: string,
  ): Promise<InfrastructureListRequestDTO> {
    const result = await this.InfrastructureService.getAllInfrastructuresOfAgivenOrganization(
      orgId,
      page || null,
      size || null,
      query || null,
    );

    if (result.pagination)
      return new InfrastructureListRequestDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else {
      return new InfrastructureListRequestDTO({
        body: { data: result.data, statusCode: 200 },
      });
    }
  }

  /**
   * delete a resource from a given infrastructure
   * @param resourceId: resource id
   * @param infrastructureId: infrastructure id
   * @returns the updated infrastructure id
   */
  @DELETE
  @Path('/infraResources/:infrastructureId/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<GetInfrastructureDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteResourceFromGivenInfrastructure(
    @PathParam('resourceId') resourceId: number,
    @PathParam('infrastructureId') infrastructureId: number,
  ): Promise<GetInfrastructureDTO> {
    const result = await this.InfrastructureService.deleteResourceFromGivenInfrastructure(resourceId, infrastructureId);
    return new GetInfrastructureDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * add a resource to a given infrastructure
   * @param resourceId: resource id
   * @param infrastructureId: infrastructure id
   * @returns the updated infrastructure id
   */
  @POST
  @Path('/infraResources/:infrastructureId/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<GetInfrastructureDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async addResourceToInfrastructure(
    @PathParam('resourceId') resourceId: number,
    @PathParam('infrastructureId') infrastructureId: number,
  ): Promise<GetInfrastructureDTO> {
    const result = await this.InfrastructureService.addResourceToInfrastructure(resourceId, infrastructureId);
    return new GetInfrastructureDTO({ body: { id: result, statusCode: 204 } });
  }
  /**
   * get an infastructure with a given Id
   * @param infraId: infastructure id
   */
  @GET
  @Path('/:id')
  @Security()
  @LoggerStorage()
  @Response<InfrastructureListRequestDTO>(200, 'Return infrastructure ')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getInfrastructureById(@PathParam('id') id: number): Promise<GetInfrastructureDTO> {
    const result = await this.InfrastructureService.getInfrastructureById(id);

    return new GetInfrastructureDTO({ body: { ...result, statusCode: 200 } });
  }

  /**
   * get all resources of a given infrastructure
   * @param id: infrastructure id
   */
  @GET
  @Path('/:id/resources')
  @Security()
  @LoggerStorage()
  @Response<InfrastructureResourcesRequestDTO>(200, 'Return infrastructure resources ')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllRessourcesOfAgivenInfrastructure(
    @PathParam('id') id: number,
  ): Promise<InfrastructureResourcesRequestDTO> {
    const result = await this.InfrastructureService.getAllResourcesOfAGivenInfrastructure(id);

    return new InfrastructureResourcesRequestDTO({ body: { data: result, statusCode: 200 } });
  }

  /**
   * get all sub infrastructures of a given infrastructure
   * @param id: infrastructure id
   */
  @GET
  @Path('/:id/subInfrastructures')
  @Security()
  @LoggerStorage()
  @Response<subInfraListRequestDTO>(200, 'Return infrastructure sub infras ')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllSubInfasOfAGivenInfrastructure(@PathParam('id') id: number): Promise<subInfraListRequestDTO> {
    const result = await this.InfrastructureService.getAllSubInfasOfAGivenInfrastructure(id);

    return new subInfraListRequestDTO({ body: { data: [...(result || [])], statusCode: 200 } });
  }
}
