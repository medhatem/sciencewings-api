import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT } from 'typescript-rest';
import { CreateOrganizationRO, UserInviteToOrgRO, ResourceRO } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { OrganizationMembersDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import {
  CreatedResourceBodyDTO,
  CreateResourceDTO,
  GetResourceBodyDTO,
  ResourceDTO,
  UpdatedResourceBodyDTO,
  UpdateResourceDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: IOrganizationService) {
    super(OrganizationService as any, new OrganizationDTO(), new UpdateOrganizationDTO());
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganization')
  @Security()
  @LoggerStorage()
  @Response<OrganizationDTO>(201, 'Organization created Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * invite a user to an organization
   * creates the newly invited user in keycloak
   *
   * @param payload
   */
  @POST
  @Path('inviteUserToOrganization')
  @Response<InviteUserDTO>(201, 'User Registred Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  @Security()
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);

    if (result.isFailure) {
      return new InviteUserDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }

  /**
   * retrive users that belongs to an organization
   *
   * @param id: organization id
   */
  @GET
  @Path('getMembers/:id')
  @Security()
  @LoggerStorage()
  @Response<OrganizationMembersDTO>(200, 'Return organization members Successfully')
  @Response<OrganizationMembersDTO>(500, 'Internal Server Error')
  public async getUsers(@PathParam('id') payload: number): Promise<OrganizationMembersDTO> {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      return new OrganizationMembersDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationMembersDTO({ body: { members: result.getValue(), statusCode: 200 } });
  }

  /**
   * retrieve all the organizations owned by a given user
   *
   * @param id: user id
   */
  @GET
  @Path('getUserOrganizations/:id')
  @Security()
  @LoggerStorage()
  @Response<OrganizationDTO>(200, 'Return Organization that the users belongs to, Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async getUserOrganizations(@PathParam('id') payload: number): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.getUserOrganizations(payload);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 200 } });
  }

  // resource routes

  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data
   */
  @POST
  @Path('resources/create')
  @Security()
  @Response<CreatedResourceBodyDTO>(201, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResource(payload: ResourceRO): Promise<CreateResourceDTO> {
    const result = await this.OrganizationService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update a resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @PUT
  @Path('resources/update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdatedResourceBodyDTO>(204, 'Resource updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResource(payload: ResourceRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResource(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('resources/getOgranizationResourcesById/:organizationId')
  @Security()
  @LoggerStorage()
  @Response<GetResourceBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getOgranizationResources(@PathParam('organizationId') organizationId: number): Promise<ResourceDTO> {
    const result = await this.OrganizationService.getResourcesOfAGivenOrganizationById(organizationId);
    if (result.isFailure) {
      return new ResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ResourceDTO({ body: { resources: result.getValue(), statusCode: 200 } });
  }
}
