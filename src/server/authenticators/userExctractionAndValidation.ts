import { IUserService } from '../modules/users/interfaces/IUserService';
import { Result } from '@/utils/Result';
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
  userExctractionAndValidation = async (req: UserRequest): Promise<Result<{ keycloakUser: any; userId?: any }>> => {
    if (!req.headers || !req.headers.authorization) {
      return Result.unauthorizedError('Not Authorized');
    }

    const token = req.headers.authorization as string;
    const result = await fetchKeyclockUserGivenToken(token);
    if (result.error) {
      return Result.unauthorizedError('Not Authorized');
    }

    const criteriaResult = await this.userService.getUserByCriteria({ email: result.email });
    if (criteriaResult.isFailure || criteriaResult.getValue() === null) {
      return Result.fail('Unrecognized user!');
    }
    const userId = criteriaResult.getValue().id;

    req.keycloakUser = result;
    req.userId = userId;

    return Result.ok({ keycloakUser: result, userId });
  };
}
