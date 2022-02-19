import { getConfig } from '@/configuration/Configuration';
import KcAdminClient from '@keycloak/keycloak-admin-client';

const dummyUsers = [
  { username: 'username1', email: 'user1@example.com' },
  { username: 'username2', email: 'user2@example.com' },
  { username: 'username3', email: 'user3@example.com' },
];

export let kcAdminClient: any;
export const generateKCUsers = async () => {
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

  const existingUsers = await kcAdminClient.users.find();
  if (existingUsers) {
    return existingUsers;
  }
  try {
    const users = await Promise.all(
      dummyUsers.map(async (user: any) => {
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
            value: 'azeaze',
          },
        });
        console.log({
          k: await kcAdminClient.users.getCredentials({
            id: kcuser.id,
            realm: getConfig('keycloak.clientValidation.realmName'),
          }),
        });
        user.id = kcuser.id;
        return kcuser;
      }),
    );
    return users;
  } catch (error) {
    console.log({ error });
    return null;
  }
};
