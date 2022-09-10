import { getConfig } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { applyToAll } from '@/utils/utilities';
import KcAdminClient from '@keycloak/keycloak-admin-client';

const dummyUsers = [
  { username: 'username1', email: 'user1@example.com' },
  { username: 'username2', email: 'user2@example.com' },
  { username: 'username3', email: 'user3@example.com' },
];

/**
 * Authentificating to Keycloack services
 */
export let kcAdminClient: any;
export const createKCUsers = async () => {
  try {
    kcAdminClient = new KcAdminClient({
      baseUrl: getConfig('keycloak.baseUrl'),
      realmName: getConfig('keycloak.realmName'),
    });

    await kcAdminClient.auth({
      username: getConfig('keycloak.username'),
      password: getConfig('keycloak.password'),
      grantType: getConfig('keycloak.grantType') as any,
      clientId: getConfig('keycloak.clientId'),
    });

    const users = await applyToAll(dummyUsers, async (user: any, idx: number) => {
      const { username, email } = user;
      const kcuser = await kcAdminClient.users.create({
        realm: getConfig('keycloak.clientValidation.realmName'),
        enabled: true,
        emailVerified: true,
        username,
        email,
      });
      await kcAdminClient.users.resetPassword({
        id: kcuser.id,
        realm: getConfig('keycloak.clientValidation.realmName'),
        credential: {
          temporary: false,
          type: 'password',
          value: `user${idx + 1}@example.com`,
        },
      });

      user.id = kcuser.id;
      return kcuser;
    });

    return users;
  } catch (error) {
    Logger.getInstance().error(error);
    return null;
  }
};

/**
 * GET Keycloack users
 */
export const getKCUsers = async () => {
  try {
    return await kcAdminClient.users.find();
  } catch (error) {
    Logger.getInstance().error(error);
    return null;
  }
};
