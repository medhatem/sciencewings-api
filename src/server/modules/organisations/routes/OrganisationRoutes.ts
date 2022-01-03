import { container, provideSingleton } from '@di/index';
import { OrganisationService } from '../services/OrganisationService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Organization } from '../models/Organization';
import { Path, POST, Security, ContextRequest } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganizationRO } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { CreatedOrganizationDTO } from '../dtos/createdOrganizationDTO';

@provideSingleton()
@Path('organisation')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganisationService: OrganisationService) {
    super(OrganisationService);
    console.log(this.OrganisationService);
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganisation')
  @Security('', KEYCLOAK_TOKEN)
  public async createOrganisation(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<CreatedOrganizationDTO> {
    const mapper = this.getMapper(CreatedOrganizationDTO);
    try {
      const created = await this.OrganisationService.createOrganization(payload, request.userId);
      return mapper.serialize<CreatedOrganizationDTO>({ body: { createdOrgId: created, statusCode: 201 } });
    } catch (error) {
      console.log('error in createOrganisation', error);
      return mapper.serialize<CreatedOrganizationDTO>({ error: { statusCode: 500, errorMessage: '' } });
    }
  }
}
