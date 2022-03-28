import { getConfig } from '@/configuration/Configuration';
import fetch from 'node-fetch';

export const fetchKeyclockUserGivenToken = async (token: string) => {
  const res = await fetch(
    `${getConfig('keycloak.baseUrl')}/realms/${getConfig(
      'keycloak.clientValidation.realmName',
    )}/protocol/openid-connect/userinfo`,
    {
      method: 'get',
      headers: {
        Authorization: `${token}`,
      },
    },
  );

  return await res.json();
};
