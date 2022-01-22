import { POST, Path, Security, ContextRequest } from 'typescript-rest';
import { container, provideSingleton } from '@di/index';

import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { Response } from 'typescript-rest-swagger';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserRequest } from '../../../types/UserRequest';
import { RegisterUserFromTokenDTO } from '../dtos/RegisterUserFromTokenDTO';
import { UserDTO } from '../dtos/UserDTO';
import { UserInviteToOrgRO } from './RequstObjects';

@provideSingleton()
@Path('user')
export class UserRoutes extends BaseRoutes<User, UserDTO> {
  constructor(private userService: UserService) {
    super(userService, UserDTO);
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
  @Response<RegisterUserFromTokenDTO>(201, 'User Registred Successfully')
  @Security([], KEYCLOAK_TOKEN)
  public async registerUserFromToken(@ContextRequest request: UserRequest): Promise<RegisterUserFromTokenDTO> {
    const mapper = this.getMapper(RegisterUserFromTokenDTO);
    try {
      const userId = await this.userService.registerUser(request.keycloakUser);
      return mapper.serialize({ body: { statusCode: 201, userId } });
    } catch (error) {
      return mapper.serialize({ statusCode: 500, errorMessage: 'Internal Server Error' });
    }
  }

  @POST
  @Path('inviteUserToOrganization')
  @Response<RegisterUserFromTokenDTO>(201, 'User Registred Successfully')
  public async inviteUserToOrganization(payload: UserInviteToOrgRO) {
    await this.userService.inviteUserByEmail(payload.email, payload.organizationId);
  }
}
