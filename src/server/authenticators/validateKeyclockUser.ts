import { Unauthorized } from '@/errors/Unauthorized';
import { UserRequest } from '@/types/UserRequest';
import { Request } from 'express';

import { fetchKeyclockUserGivenToken } from './fetchKeyclockUserGivenToken';

export const validateKeyclockUser = async (request: Request) => {
  const token = request.headers.authorization as string;

  const result = await fetchKeyclockUserGivenToken(token);

  if (result.error) {
    throw new Unauthorized('Not Authorized');
  }

  (request as any as UserRequest).keycloakUser = result;
};
