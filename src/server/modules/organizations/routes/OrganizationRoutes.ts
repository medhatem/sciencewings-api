import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT, DELETE } from 'typescript-rest';
import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationMemberSettingsRO,
  OrganizationReservationSettingsRO,
  UpdateOrganizationRO,
} from './RequestObject';
import { UserRequest } from '@/types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { UserOrganizationsDTO } from '@/modules/organizations/dtos/UserOrganizationsDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { OrganizationMembersDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import { UpdateResourceBodyDTO } from '@/modules/resources/dtos/ResourceDTO';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { PhoneBaseBodyDTO, PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressBaseDTO, AddressBodyDTO } from '@/modules/address/dtos/AddressDTO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import {
  GetOrganizationSettingsBodyDTO,
  GetOrganizationSettingsDTO,
  UpdateOrganizationSettingsBodyDTO,
  UpdateOrganizationSettingsDTO,
} from '@/modules/organizations/dtos/OrganizationSettingsDto';

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
   * @param payload Should contain general data Organization
   * @param id  id of the updated organization
   *
   */
  @PUT
  @Path('updateOrganization/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Organization updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganization(
    payload: UpdateOrganizationRO,
    @PathParam('id') id: number,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.updateOrganizationGeneraleProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /**
   * Delete an organization in the database
   *
   * @param id  id of the delete organization
   *
   */
  @DELETE
  @Path('delete/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Organization delted Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteOrganization(
    payload: UpdateOrganizationRO,
    @PathParam('id') id: number,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.deleteOrganization(id);

    if (result.isFailure) {
      throw result.error;
    }
    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * add an phone to a given organization
   *
   * @param payload Should contain new organization phone details
   *
   * @param id id of the updated organization
   *
   */
  @POST
  @Path('phone/:id')
  @Security()
  @LoggerStorage()
  @Response<PhoneBaseBodyDTO>(204, 'Organization phone created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationPhone(payload: PhoneRO, @PathParam('id') id: number): Promise<PhoneDTO> {
    const result = await this.OrganizationService.addPhoneToOrganization(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new PhoneDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * create a new organization address in the database
   *
   * @param payload add phone to organization as a name
   *
   * @param id id of the updated organization
   *
   */
  @POST
  @Path('address/:id')
  @Security()
  @LoggerStorage()
  @Response<AddressBodyDTO>(204, 'Organization address created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationAdress(payload: AddressRO, @PathParam('id') id: number): Promise<AddressBaseDTO> {
    const result = await this.OrganizationService.addAddressToOrganization(payload, id);

    if (result.isFailure) {
      throw result.error;
    }
    return new AddressBaseDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Response<UserOrganizationsDTO>(200, 'Return Organization that the users belongs to, Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUserOrganizations(@PathParam('id') id: number): Promise<UserOrganizationsDTO> {
    const result = await this.OrganizationService.getUserOrganizations(id);

    if (result.isFailure) {
      return new UserOrganizationsDTO({ body: { organizations: [], statusCode: 200 } });
    }

    return new UserOrganizationsDTO({ body: { organizations: result.getValue(), statusCode: 200 } });
  }
  /**
   * retrieve Organization settings by organization id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('settings/:id')
  @Security()
  @LoggerStorage()
  @Response<GetOrganizationSettingsBodyDTO>(200, 'Organization Settings Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOgranizationSettings(@PathParam('id') id: number): Promise<GetOrganizationSettingsDTO> {
    const result = await this.OrganizationService.getOrganizationSettingsById(id);
    if (result.isFailure) {
      throw result.error;
    }

    return new GetOrganizationSettingsDTO({ body: { data: result.getValue(), statusCode: 200 } });
  }

  /* Update a organization settings, section members
   *
   * @param payload
   * @param id of the requested resource
   *
   */
  @PUT
  @Path('settings/member/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization reservation  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnMembersProperties(
    payload: OrganizationMemberSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /* Update a organization settings, section reservation
   *
   * @param payload
   * @param id is the is of requested resource
   *
   */
  @PUT
  @Path('settings/reservation/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization reservation  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnReservationProperties(
    payload: OrganizationReservationSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /* Update a organization settings, section invoices
   *
   * @param payload
   * @param id is the is of the resource
   *
   */
  @PUT
  @Path('settings/invoices/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization invoices settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnInvoicesProperties(
    payload: OrganizationInvoicesSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /* Update a organization settings, section access
   *
   * @param payload
   * @param id is the is of requested resource
   *
   */
  @PUT
  @Path('settings/access/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization access  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnAccessProperties(
    payload: OrganizationAccessSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
