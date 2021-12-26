// import { CredentialsRO, UserRO, UserSignedInRO, UserSignedUpRO } from '../routes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Organisation } from '@modules/organisations/models/Organisation';
import { OrganisationDao } from '../daos/OrganisationDao';

@provideSingleton()
export class OrganisationService extends BaseService<Organisation> {
  constructor(public dao: OrganisationDao) {
    super(dao);
  }

  static getInstance(): OrganisationService {
    return container.get(OrganisationService);
  }
}
