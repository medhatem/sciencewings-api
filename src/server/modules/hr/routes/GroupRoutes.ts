import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Group } from '@/modules/hr/models/Group';
import { Path, PathParam, POST, PUT, Security, DELETE, GET } from 'typescript-rest';
import { GroupDTO, CreateGroupDTO, UpdateGroupDTO } from '@/modules/hr/dtos/GroupDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { Response } from 'typescript-rest-swagger';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';

@provideSingleton()
@Path('groups')
export class GroupRoutes extends BaseRoutes<Group> {
  constructor(private groupService: IGroupService) {
    super(groupService as any, new CreateGroupDTO(), new UpdateGroupDTO());
  }

  static getInstance(): GroupRoutes {
    return container.get(GroupRoutes);
  }

  /**
   * create a group that the organization offer
   * @param payload
   * @returns the created group id
   */
  @GET
  @Path('getOrganizationGroup/:organizationId')
  @Security()
  @LoggerStorage()
  @Response<GroupRO>(200, 'Group fetched Successfully')
  @Response<GroupRO>(500, 'Internal Server Error')
  public async getOrganizationGroup(@PathParam('organizationId') organizationId: number): Promise<GroupDTO> {
    const result = await this.groupService.getOrganizationGroup(organizationId);

    if (result.isFailure) {
      return new GroupDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new GroupDTO({ body: { data: [result.getValue()], statusCode: 201 } });
  }

  /**
   * create a group that the organization offer
   * @param payload
   * @returns the created group id
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<GroupRO>(201, 'Group created Successfully')
  @Response<GroupRO>(500, 'Internal Server Error')
  public async createGroup(payload: GroupRO): Promise<GroupDTO> {
    const result = await this.groupService.createGroup(payload);

    if (result.isFailure) {
      return new GroupDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new GroupDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * update a group data given its id
   * @param payload
   * @param id
   * @returns the updated group id
   */
  @PUT
  @Path('/update/:id')
  @Security()
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateGroup(payload: GroupRO, @PathParam('id') id: number): Promise<GroupDTO> {
    const result = await this.groupService.updateGroup(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new GroupDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * update a group data given its id
   * @param payload
   * @param id
   * @returns the updated group id
   */
  @PUT
  @Path('/groupMember/:id')
  @Security()
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateGroupMember(payload: GroupRO, @PathParam('id') id: number): Promise<GroupDTO> {
    const result = await this.groupService.updateGroupMember(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new GroupDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * delete a group data given its id
   * @param payload
   * @param id
   * @returns the deleted group id
   */
  @DELETE
  @Path('/delete/:id')
  @Security()
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group deleted Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteGroup(@PathParam('id') id: number): Promise<GroupDTO> {
    const result = await this.groupService.deleteGroup(id);

    if (result.isFailure) {
      throw result.error;
    }

    return new GroupDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
