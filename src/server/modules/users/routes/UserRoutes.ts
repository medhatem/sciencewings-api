import { POST, Path, Security, ContextRequest } from 'typescript-rest';
import { UserGetRO, UserUpdateRO } from './RequestObject';
import { container, provideSingleton } from '@di/index';

import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { Response } from 'typescript-rest-swagger';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserRequest } from '../../../types/UserRequest';

@provideSingleton()
@Path('user')
export class UserRoutes extends BaseRoutes<User> {
  constructor(private userService: UserService) {
    super(userService, UserGetRO, UserUpdateRO);
    console.log(this.userService);
  }

  static getInstance(): UserRoutes {
    return container.get(UserRoutes);
  }

  /**
   * Registers a new user in the database
   * this route is called after signup
   * since keycloak takes care of creating the user
   * we parse the user data from the keycloak token
   * and save it to the database
   *
   * @param request
   */
  @POST
  @Path('registerUserFromToken')
  @Response(201, 'User Registred Successfully')
  @Security([], KEYCLOAK_TOKEN)
  public async registerUserFromToken(@ContextRequest request: UserRequest): Promise<{ [key: string]: any }> {
    try {
      const userId = await this.userService.registerUser(request.keycloakUser);
      return {
        body: {
          userId,
        },
      };
    } catch (error) {
      return {
        error: 'Internal Server Error',
      };
    }
  }
}
