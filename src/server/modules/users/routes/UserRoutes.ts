import { POST, Path, Security, ContextRequest } from 'typescript-rest';
import { container, provideSingleton } from '@di/index';

import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { Response } from 'typescript-rest-swagger';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserRequest } from '../../../types/UserRequest';
import { InviteUserDTO, RegisterUserFromTokenDTO, ResetPasswordDTO } from '../dtos/RegisterUserFromTokenDTO';
import { UserDTO } from '../dtos/UserDTO';
import { ResetPasswordRO, UserInviteToOrgRO } from './RequstObjects';
import { WrapRoute } from '../../../decorators/requestDecorators/WrapRoute';

@provideSingleton()
@Path('users')
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
  @WrapRoute(RegisterUserFromTokenDTO)
  public async registerUserFromToken(@ContextRequest request: UserRequest): Promise<RegisterUserFromTokenDTO> {
    const userId = await this.userService.registerUser(request.keycloakUser);
    return ({ statusCode: 201, userId } as any) as RegisterUserFromTokenDTO;
  }

  /**
   * invite a user to an organization
   * creates the newly invited user in keycloak
   *
   * @param payload
   */
  @POST
  @Path('inviteUserToOrganization')
  @Response<InviteUserDTO>(201, 'User Registred Successfully')
  @Security([], KEYCLOAK_TOKEN)
  @WrapRoute(InviteUserDTO)
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const userId = await this.userService.inviteUserByEmail(payload.email, payload.organizationId);
    return ({ userId, statusCode: 201 } as any) as InviteUserDTO;
  }

  /**
   *  Method that resets a user password in keycloak
   *
   * @param payload
   */
  @POST
  @Path('resetPassword')
  @Response<ResetPasswordDTO>(201, 'Password reset successfully')
  @Security([], KEYCLOAK_TOKEN)
  @WrapRoute(ResetPasswordDTO)
  public async resetPassword(payload: ResetPasswordRO): Promise<ResetPasswordDTO> {
    await this.userService.resetPassword(payload);
    return ({ message: 'Password reset successful' } as any) as ResetPasswordDTO;
  }
}
