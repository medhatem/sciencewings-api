import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Email } from '@utils/Email';
import { EmailMessage } from '../../../types/types';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { OrganisationService } from '@modules/organisations/services/OrganisationService';
import { User } from '@modules/users/models/User';
import { UserDao } from '../daos/UserDao';

@provideSingleton()
export class UserService extends BaseService<User> {
  constructor(
    public dao: UserDao,
    public organizationService: OrganisationService,
    public keycloak: Keycloak = Keycloak.getInstance(),
    public emailService = Email.getInstance(),
  ) {
    super(dao);
  }

  static getInstance(): UserService {
    return container.get(UserService);
  }

  async registerUser(userInfo: KeycloakUserInfo): Promise<number> {
    // get the userKeyCloakId
    const users = await this.keycloak.getAdminClient().users.find({ email: userInfo.email, realm: 'sciencewings-web' });

    if (!users || !users.length) {
      throw new Error('No user found!');
    }
    const user = this.dao.model;
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    const createdUser = await this.dao.create(user);
    return createdUser.id;
  }

  /**
   * fetches a user based on some search criteria
   *
   * @param criteria the search criteria
   */
  async getUserByCriteria(criteria: { [key: string]: any }) {
    return await this.dao.getByCriteria(criteria);
  }

  async inviteUserByEmail(email: string, orgId: number): Promise<number> {
    const existingUser = await this.keycloak.getAdminClient().users.find({ email, realm: 'sciencewings-web' });
    if (existingUser.length > 0) {
      throw new Error('The user already exists.');
    }

    const existingOrg = await this.organizationService.get(orgId);

    if (!existingOrg) {
      throw new Error('The organization to add the user to does not exist.');
    }

    const createdKeyCloakUser = await this.keycloak.getAdminClient().users.create({
      email,
      firstName: '',
      lastName: '',
      realm: 'sciencewings-web',
    });

    //save created keycloak user in the database
    const user = this.dao.model;
    user.firstname = '';
    user.lastname = '';
    user.email = email;
    user.keycloakId = createdKeyCloakUser.id;
    const savedUser = await this.dao.create(user);

    // add the invited user to the organization
    await existingOrg.users.init();
    existingOrg.users.add(savedUser);

    await this.dao.update(savedUser);

    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);

    return savedUser.id;
  }
}
