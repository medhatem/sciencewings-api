import { ACCESS_TOKEN_HEADER } from './constants';
import { IUserService } from '@modules/users/interfaces/IUserService';
import { Unauthorized } from '@errors/Unauthorized';
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
  userExctractionAndValidation = async (req: UserRequest): Promise<void> => {
    if (!req.headers || !req.headers[ACCESS_TOKEN_HEADER]) {
      throw new Unauthorized();
    }

    const token = req.headers[ACCESS_TOKEN_HEADER] as string;

    const res = await fetch(
      `${getConfig('keycloak.baseUrl')}/realms/${getConfig(
        'keycloak.clientValidation.realmName',
      )}/protocol/openid-connect/userinfo`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await res.json();
    if (result.error) {
      throw new Unauthorized();
    }
    const user = await this.userService.getUserByCriteria({ email: result.email });
    let userId = user ? user.id : null;
    if (!user) {
      const registerUserResult = await this.userService.registerUser(result);
      if (registerUserResult.isFailure) {
        throw new Error('Unexpected Error!');
      }
      userId = registerUserResult.getValue();
    }
    req.keycloakUser = result;
    req.userId = userId;
  };
}
