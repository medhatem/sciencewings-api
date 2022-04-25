import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT } from 'typescript-rest';
import {
  CreateOrganizationRO,
  UserInviteToOrgRO,
  ResourceRO,
  UserResendPassword,
  UpdateOrganizationRO,
} from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { OrganizationMembersDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import {
  CreatedResourceBodyDTO,
  CreateResourceDTO,
  GetResourceBodyDTO,
  ResourceDTO,
  UpdateResourceBodyDTO,
  UpdateResourceDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { PhoneBaseBodyDTO, PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { createPhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressBaseDTO, AddressBodyDTO } from '@/modules/address/dtos/AddressDTO';
import { AddressRO } from '@/modules/address/routes/AddressRO';

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
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      throw result.error;
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }
  /**
   * Update an organization in the database
   *
   * @param payload
   * Should contain general data Organization
   * @param id
   * id of the updated organization
   */
  @PUT
  @Path('updateOrganization/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Organization updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganization(
    @PathParam('id') id: number,
    payload: UpdateOrganizationRO,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.updateOrganizationGeneraleProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  //Organization Phones Routes
  /**
   * create a new organization phone in the database
   *
   * @param payload
   * Should contain new organization phone details
   * @param id
   * id of the updated organization
   */
  @POST
  @Path('phone/:id')
  @Security()
  @LoggerStorage()
  @Response<PhoneBaseBodyDTO>(204, 'Organization phone created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationPhone(@PathParam('id') id: number, payload: createPhoneRO): Promise<PhoneDTO> {
    const result = await this.OrganizationService.addPhoneToOrganization(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new PhoneDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  //Organization Addresses Routes
  /**
   * create a new organization address in the database
   *
   * @param payload
   * Should contain organization address details
   * @param id
   * id of the updated organization
   */
  @POST
  @Path('address/:id')
  @Security()
  @LoggerStorage()
  @Response<AddressBodyDTO>(204, 'Organization address created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationAdress(@PathParam('id') id: number, payload: AddressRO): Promise<AddressBaseDTO> {
    const result = await this.OrganizationService.addAddressToOrganization(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new AddressBaseDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @Security()
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);
    if (result.isFailure) {
      throw result.error;
    }

    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }

  /**
   * resend the reset password email to the invited user
   *
   * @param payload
   *
   */
  @POST
  @Path('resendInvite')
  @Response<UserIdDTO>(200, 'invite resent successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @Security()
  @LoggerStorage()
  public async resendInvite(payload: UserResendPassword): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.resendInvite(payload.userId, payload.orgId);

    if (result.isFailure) {
      throw result.error;
    }
    return new InviteUserDTO({
      body: { statusCode: 200, id: result.getValue() },
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
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUsers(@PathParam('id') payload: number): Promise<OrganizationMembersDTO> {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      throw result.error;
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
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUserOrganizations(@PathParam('id') payload: number): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.getUserOrganizations(payload);

    if (result.isFailure) {
      throw result.error;
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 200 } });
  }

  // resource routes

  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data
   */
  @POST
  @Path('resources/create')
  @Security()
  @Response<CreatedResourceBodyDTO>(201, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async createResource(payload: ResourceRO): Promise<CreateResourceDTO> {
    const result = await this.OrganizationService.createResource(payload);

    if (result.isFailure) {
      throw result.error;
    }
    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update a resource in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data with its id
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('resources/update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResource(payload: ResourceRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResource(payload, id);

    if (result.isFailure) {
      throw result.error;
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
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOgranizationResources(@PathParam('organizationId') organizationId: number): Promise<ResourceDTO> {
    const result = await this.OrganizationService.getResourcesOfAGivenOrganizationById(organizationId);
    if (result.isFailure) {
      throw result.error;
    }

    return new ResourceDTO({ body: { data: [...result.getValue()], statusCode: 200 } });
  }
}
