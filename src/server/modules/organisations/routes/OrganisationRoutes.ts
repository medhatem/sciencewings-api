import { container, provideSingleton } from '@di/index';
import { OrganisationService } from '../services/OrganisationService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Organisation } from '../models/Organisation';
import { Path, POST, Security, ContextRequest } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganisationRO } from '../RO/CreateOrganisationRO';
import { UserRequest } from '../../../types/UserRequest';

@provideSingleton()
@Path('organisation')
export class OrganisationRoutes extends BaseRoutes<Organisation> {
  constructor(private OrganisationService: OrganisationService) {
    super(OrganisationService);
    console.log(this.OrganisationService);
  }

  static getInstance(): OrganisationRoutes {
    return container.get(OrganisationRoutes);
  }

  @POST
  @Path('createOrganisation')
  @Security('', KEYCLOAK_TOKEN)
  public async createOrganisation(payload: CreateOrganisationRO, @ContextRequest request: UserRequest) {
    try {
      const created = await this.OrganisationService.createOrganisation(payload, request.keycloakUser);
      console.log('created is ---', created);
    } catch (error) {
      console.log('error in createOrganisation', error);
    }
  }
}
