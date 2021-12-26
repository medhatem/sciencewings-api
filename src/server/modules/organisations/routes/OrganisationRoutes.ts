import { container, provideSingleton } from '@di/index';
import { OrganisationService } from '../services/OrganisationService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Organisation } from '../models/Organisation';
import { Path, GET, QueryParam } from 'typescript-rest';

@provideSingleton()
@Path('organisation')
export class OrganisationRoutes extends BaseRoutes<Organisation> {
  constructor(private OrganisationService: OrganisationService) {
    super(OrganisationService);
  }

  static getInstance(): OrganisationRoutes {
    return container.get(OrganisationRoutes);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
