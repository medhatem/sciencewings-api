import { NotFoundError, Unauthorized } from '@/Exceptions';

import { IUserService } from '../modules/users/interfaces/IUserService';
import { UserRequest } from '../types/UserRequest';
import { fetchKeyclockUserGivenToken } from './fetchKeyclockUserGivenToken';
import { provideSingleton } from '@/di';

@provideSingleton()
export class UserExctractionAndValidation {
  constructor(private userService: IUserService) {}
  /**
   *
   * Calls keycloak to validate whether the token is valid or not
   * if the token is not valid throw an Unauthorized error
   * if the token is valid add the keycloak user information into the request
   *
   * @param req express request
   */
  userExctractionAndValidation = async (req: UserRequest): Promise<{ keycloakUser: any; userId?: any }> => {
    if (!req.headers || !req.headers.authorization) {
      throw new Unauthorized('HTTP_401_UNAUTHORIZED');
    }

    const token = req.headers.authorization as string;
    const result = await fetchKeyclockUserGivenToken(token);
    if (result.error) {
      throw new Unauthorized('HTTP_401_UNAUTHORIZED');
    }

    const criteriaResult = await this.userService.getUserByCriteria({ email: result.email });
    if (!criteriaResult) {
      throw new NotFoundError('UNKNOWN_USER', { friendly: true });
    }
    const userId = criteriaResult.id;

    req.keycloakUser = result;
    req.userId = userId;

    return { keycloakUser: result, userId };
  };
}
