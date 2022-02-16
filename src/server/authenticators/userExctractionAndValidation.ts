import { IUserService } from '../modules/users/interfaces/IUserService';
import { Result } from '@utils/Result';
import { UserRequest } from '../types/UserRequest';
import fetch from 'node-fetch';
import { getConfig } from '../configuration/Configuration';
import { provideSingleton } from '../di';

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
  userExctractionAndValidation = async (req: UserRequest): Promise<Result<{ keycloakUser: any; userId: any }>> => {
    if (!req.headers || !req.headers.authorization) {
      return Result.fail('Not Authorized');
    }

    const token = req.headers.authorization as string;
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
    const result = await res.json();
    if (result.error) {
      return Result.fail('Not Authorized');
    }
    const criteriaResult = await this.userService.getUserByCriteria({ email: result.email });
    if (criteriaResult.isFailure) {
      return Result.fail('Unrecognized user!');
    }

    let userId = criteriaResult.getValue() ? criteriaResult.getValue().id : null;
    if (!criteriaResult) {
      const registerUserResult = await this.userService.registerUser(result);
      if (registerUserResult.isFailure) {
        return Result.fail('Unexpected Error!');
      }
      userId = registerUserResult.getValue();
    }

    req.keycloakUser = result;
    req.userId = userId;

    return Result.ok({ keycloakUser: result, userId });
  };
}
