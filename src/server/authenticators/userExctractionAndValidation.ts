import { ACCESS_TOKEN_HEADER } from './constants';
import { Unauthorized } from '@errors/Unauthorized';
import { UserRequest } from '../types/UserRequest';
import fetch from 'node-fetch';

/**
 *
 * Calls keycloak to validate whether the token is valid or not
 * if the token is not valid throw an Unauthorized error
 * if the token is valid add the keycloak user information into the request
 *
 * @param req express request
 */
export const userExctractionAndValidation = async (req: UserRequest): Promise<void> => {
  if (!req.headers || !req.headers[ACCESS_TOKEN_HEADER]) {
    throw new Unauthorized();
  }

  const token = req.headers[ACCESS_TOKEN_HEADER] as string;
  const res = await fetch('http://localhost:8080/auth/realms/sciencewings-web/protocol/openid-connect/userinfo', {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  if (result.error) {
    throw new Unauthorized();
  }
  console.log('result is --- ', result);
  req.keycloakUser = result;
};
