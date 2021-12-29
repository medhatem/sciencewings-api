// import { CredentialsRO, UserRO, UserSignedInRO, UserSignedUpRO } from '../routes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganisationRO } from '../RO/CreateOrganisationRO';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { Organisation } from '@modules/organisations/models/Organisation';
import { OrganisationDao } from '../daos/OrganisationDao';
import { UserDao } from '@modules/users/daos/UserDao';

@provideSingleton()
export class OrganisationService extends BaseService<Organisation> {
  constructor(public dao: OrganisationDao, public userDao: UserDao) {
    super(dao);
  }

  static getInstance(): OrganisationService {
    return container.get(OrganisationService);
  }

  /**
   * create a new organisation
   * An organisation in keycloak is represented with a group
   * So we need to create the group first and get its id
   * Then we create the final organisation in the database by including the keycloak
   * group id
   *
   * @param payload
   */
  public async createOrganisation(payload: CreateOrganisationRO, keycloakUser: KeycloakUserInfo): Promise<number> {
    try {
      const user = await this.userDao.getByCriteria({ email: keycloakUser.email });
      // create the group in keycloak
      const group = await this.keycloak
        .getAdminClient()
        .groups.create({ name: payload.name, realm: 'sciencewings-web' });

      // create role {group}.admin for the newly created group
      const createdRole = await this.keycloak
        .getAdminClient()
        .roles.create({ name: `${payload.name}.admin`, realm: 'sciencewings-web' });

      // fetch the newly created role by name
      const role = await this.keycloak
        .getAdminClient()
        .roles.findOneByName({ name: createdRole.roleName, realm: 'sciencewings-web' });

      // add the created role to the group
      await this.keycloak.getAdminClient().groups.addRealmRoleMappings({
        id: group.id,
        roles: [{ name: role.name, id: role.id }],
        realm: 'sciencewings-web',
      });

      // add the user to the group
      await this.keycloak
        .getAdminClient()
        .users.addToGroup({ groupId: group.id, realm: 'sciencewings-web', id: user.keycloakId });

      const organisation = this.dao.model;
      organisation.name = payload.name;
      organisation.keycloakGroupId = group.id;
      organisation.users.init();
      organisation.users.add(user);

      return await this.create(organisation);

      //get the group's id and save everything in db
    } catch (error) {
      // remove keycloak created role and group
      // since the organisation creation in the db failed
      console.log('error is --- ', error);
      return 0;
    }
  }
}
