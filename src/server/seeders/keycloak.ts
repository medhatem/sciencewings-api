import KcAdminClient from '@keycloak/keycloak-admin-client';
import { config } from './config';

const dummyUsers = [
  { username: 'username1', email: 'user1@example.com' },
  { username: 'username2', email: 'user2@example.com' },
  { username: 'username3', email: 'user3@example.com' },
];

export let kcAdminClient: any;
export const generateKCUsers = async () => {
  kcAdminClient = new KcAdminClient({
    baseUrl: config.baseUrl,
    realmName: config.realmName,
  });

  await kcAdminClient.auth({
    username: config.username,
    password: config.password,
    grantType: config.grantType as any,
    clientId: config.clientId,
  });

  const existingUsers = await kcAdminClient.users.find();
  try {
    const users = await Promise.all(
      dummyUsers.map(async (user: any) => {
        const { username, email } = user;
        const kcuser = await kcAdminClient.users.create({
          realm: 'sciencewings-web',
          enabled: true,
          emailVerified: true,
          username,
          email,
        });
        await kcAdminClient.users.resetPassword({
          id: kcuser.id,
          realm: config.clientValidation.realmName,
          credential: {
            temporary: false,
            type: 'password',
            value: 'azeaze',
          },
        });
        console.log({
          k: await kcAdminClient.users.getCredentials({ id: kcuser.id, realm: config.clientValidation.realmName }),
        });
        user.id = kcuser.id;
        return kcuser;
      }),
    );
    return users;
  } catch (error) {
    console.log({ error });

    return existingUsers;
  }
};
