import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Group } from '@/modules/hr/models/Group';
import { Path, PathParam, POST, PUT, Security, DELETE, GET } from 'typescript-rest';
import { GroupDTO, CreateGroupDTO, UpdateGroupDTO } from '@/modules/hr/dtos/GroupDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { GroupMembership, GroupRO } from '@/modules/hr/routes/RequestObject';
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
   * get organization groups
   * @param payload
   * @returns the created group id
   */
  @GET
  @Path('getOrganizationGroup/:organizationId')
  @Security()
  @LoggerStorage()
  @Response<GroupRO>(200, 'Group fetched Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationGroup(@PathParam('organizationId') organizationId: number): Promise<GroupDTO> {
    const result = await this.groupService.getOrganizationGroup(organizationId);

    return new GroupDTO({ body: { ...result, statusCode: 201 } });
  }

  /**
   * create a group
   * @param payload
   * @returns the created group id
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<GroupRO>(201, 'Group created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  public async createGroup(payload: GroupRO): Promise<GroupDTO> {
    const result = await this.groupService.createGroup(payload);

    return new GroupDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * update group by id
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

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * add group memebers by id
   * @param payload
   * @param id
   * @returns the inserted member id
   */
  @POST
  @Path('/groupMember/:groupid')
  @Security()
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateGroupMember(member: GroupMembership, @PathParam('groupid') groupid: number): Promise<GroupDTO> {
    const result = await this.groupService.addGroupMember(member, groupid);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * delete group memebers by id
   * @param payload
   * @param id
   * @returns the deleted member id
   */
  @DELETE
  @Path('/groupMember/:groupid')
  @Security()
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteGroupMember(member: GroupMembership, @PathParam('groupid') groupid: number): Promise<GroupDTO> {
    const result = await this.groupService.deleteGroupMember(member, groupid);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * delete group by id
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

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }
}
